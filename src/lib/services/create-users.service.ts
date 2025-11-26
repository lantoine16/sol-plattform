import { getPayloadClient } from '@/lib/data/payload-client'
import { User } from '@/payload-types'
import { parseBulkData } from '@/domain/utils/parse-bulk-data.util'
import type { UserRoleValue } from '@/domain/constants/user-role.constants'
import { userRepository } from '@/lib/data/repositories/user.repository'
import { isValidEmail } from '@/domain/utils/validate-email.util'
import { taskRepository } from '../data/repositories/task.repository'
import { taskProgressRepository } from '../data/repositories/task-progress.repository'
export interface BulkUserData {
  lastname: string
  firstname: string
  password: string
  email: string | null
  username: string | null
}

export async function processBulkUserCreate(input: {
  bulkData: string
  learningGroup: string[] | null
  learningLocation: string | null
  role: UserRoleValue
  graduation: string
}): Promise<User[]> {
  const lines = parseBulkData(input.bulkData)

  if (lines.length === 0) {
    throw new Error('Keine Benutzerdaten angegeben')
  }

  const { emails: existingEmails, usernames: existingUsernames } =
    await userRepository.getAllUsernamesAndEmails()
  const validatedUsers = lines.map((line) => {
    const values = line.split(',').map((s) => s.trim())
    if (values.length < 3) {
      throw new Error('Zu wenige Werte im Datensatz: ' + line)
    }
    const lastname = values[0]
    const firstname = values[1]
    const password = values[2]
    const email = values.length > 3 ? values[3] : null
    let username = values.length > 4 ? values[4] : null
    if (lastname === '') {
      throw new Error('Nachname darf nicht leer sein im Datensatz: ' + line)
    }
    if (firstname === '') {
      throw new Error('Vorname darf nicht leer sein im Datensatz: ' + line)
    }
    if (password.length < 3) {
      throw new Error('Passwort muss mindestens 3 Zeichen lang sein im Datensatz: ' + line)
    }
    if (username && existingUsernames.includes(username)) {
      throw new Error(`Benutzername ${username} bereits vorhanden`)
    }
    if (email && existingEmails.includes(email)) {
      throw new Error(`Email ${email} bereits vorhanden`)
    }

    if (email && !isValidEmail(email)) {
      throw new Error(`Ungültige E-Mail-Adresse: ${email}`)
    }

    if (username === null || username === '') {
      username = firstname.toLowerCase() + '.' + lastname.toLowerCase()
      if (existingUsernames.includes(username)) {
        let counter = 1
        while (existingUsernames.includes(username + counter.toString())) {
          counter++
        }
        username = username + counter.toString()
      }
    }
    existingUsernames.push(username)
    return { lastname, firstname, password, username, email }
  })

  const createdUsers = await Promise.all(
    validatedUsers.map(async ({ lastname, firstname, password, username, email }) => {
      return userRepository.create({
        lastname,
        firstname,
        password,
        username,
        email,
        learningGroup: input.learningGroup,
        learningLocation: input.learningLocation,
        role: input.role,
        graduation: input.graduation,
      })
    }),
  )

  if (input.learningGroup && input.learningGroup.length > 0) {
    const userIds = createdUsers.map((user) => user.id)
    const tasksFromLearningGroupsAndUsers = await taskRepository.getTasksFromLearningGroupsAndUsers(
      input.learningGroup,
      userIds,
    )
    const tasksFromLearningGroupsAndUsersIds = tasksFromLearningGroupsAndUsers.map(
      (task) => task.id,
    )
    await taskProgressRepository.createTaskProgresses({
      user: userIds,
      task: tasksFromLearningGroupsAndUsersIds,
    })
  }
  return createdUsers
}

export async function updateTaskProgressesForUser(user: User): Promise<void> {
  const learningGroupIds: string[] | null | undefined = user.learningGroup
    ? user.learningGroup.map((lg) => (typeof lg === 'string' ? lg : lg.id))
    : null

  // Die Tasks, die der Benutzer am Ende haben muss (aus Lerngruppen ODER direkt zugewiesen)
  const tasksAssignedToUser = (
    await taskRepository.getTasksFromLearningGroupsAndUsers(learningGroupIds ?? [], [user.id])
  ).map((task) => task.id)

  const taskIdsWithExistingTaskProgressesForUser =
    (await taskProgressRepository.findByUserAndTask(null, [user.id]))?.map((taskProgress) =>
      typeof taskProgress.task === 'string' ? taskProgress.task : taskProgress.task.id,
    ) ?? []

  const tasksIdsToCreatetaskProgress = tasksAssignedToUser?.filter(
    (taskId) => !taskIdsWithExistingTaskProgressesForUser?.includes(taskId),
  )
  const taskIdsWithTaskProgressToDelete = taskIdsWithExistingTaskProgressesForUser?.filter(
    (taskId) => !tasksAssignedToUser?.includes(taskId),
  )

  if (tasksIdsToCreatetaskProgress?.length > 0) {
    await taskProgressRepository.createTaskProgresses({
      user: [user.id],
      task: tasksIdsToCreatetaskProgress,
    })
  }
  if (taskIdsWithTaskProgressToDelete?.length > 0) {
    await taskProgressRepository.deleteTaskProgresses([user.id], taskIdsWithTaskProgressToDelete)
  }
}
