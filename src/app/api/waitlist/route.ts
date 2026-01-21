import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface WaitlistEntry {
  email: string
  experience: 'none' | 'some' | 'active'
  timestamp: string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'waitlist.json')

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeWaitlist(entries: WaitlistEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2))
}

export async function POST(request: Request) {
  const { email, experience } = await request.json()

  const entries = await readWaitlist()

  // Check for duplicate email
  const isDuplicate = entries.some(entry => entry.email.toLowerCase() === email.toLowerCase())
  if (isDuplicate) {
    return NextResponse.json({ success: false, error: 'duplicate' }, { status: 409 })
  }

  entries.push({
    email,
    experience,
    timestamp: new Date().toISOString()
  })

  await writeWaitlist(entries)

  return NextResponse.json({ success: true })
}
