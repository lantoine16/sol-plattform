import Image from 'next/image'

export default function Logo() {
  return (
    <div>
      <Image src="/igs-logo.png" alt="IGS Logo" width={100} height={100} />
    </div>
  )
}
