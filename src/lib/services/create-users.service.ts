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
  role: UserRoleValue
}): Promise<User[]> {
  const lines = parseBulkData(input.bulkData)

  if (lines.length === 0) {
    throw new Error('Keine Benutzerdaten angegeben')
  }

  const { emails: existingEmails, usernames: existingUsernames } =
    await userRepository.getAllUsernamesAndEmails()
  console.log(existingEmails, existingUsernames)
  const validatedUsers = lines.map((line) => {
    console.log(line.split(',').map((s) => s.trim()))
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
    if (password === '') {
      throw new Error('Passwort darf nicht leer sein im Datensatz: ' + line)
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
        role: input.role,
      })
    }),
  )

  if (input.learningGroup && input.learningGroup.length > 0) {
    const tasksFromLearningGroups = await taskRepository.getTasksFromLearningGroups(
      input.learningGroup,
    )
    const tasksFromLearningGroupsIds = tasksFromLearningGroups.map((task) => task.id)
    const userIds = createdUsers.map((user) => user.id)
    await taskProgressRepository.createTaskProgresses({
      user: userIds,
      task: tasksFromLearningGroupsIds,
    })
  }
  return createdUsers
}
