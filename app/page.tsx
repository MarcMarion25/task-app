'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'



export default function Home() {
  const [tasks, setTasks] = useState<any[]>([])
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  'notes'
  const [notes, setNotes] = useState<any[]>([])
const [noteText, setNoteText] = useState('')
const [noteDate, setNoteDate] = useState('')
const [spec, setSpec] = useState('')
const [taskId, setTaskId] = useState('')
const [session, setSession] = useState<any>(null)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [loading, setLoading] = useState(true)

function getNextDay(dateStr: string) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}
function goToPreviousDay() {
  const d = new Date(noteDate)
  d.setDate(d.getDate() - 1)
  setNoteDate(d.toISOString().split('T')[0])
}

function goToNextDay() {
  const d = new Date(noteDate)
  d.setDate(d.getDate() + 1)
  setNoteDate(d.toISOString().split('T')[0])
}
function createNoteFromTask(task: any) {
  console.log('task selected', task.id)

  setTaskId(task.id)
  setNoteText('')   // or task.title if you want prefill
  setSpec('')
}
async function fetchNotes() {
  if (!noteDate) return

  const { data } = await supabase
    .from('dailynotes')
    .select('*')
    .gte('created_at', noteDate)
    .lt('created_at', getNextDay(noteDate))
    .order('created_at', { ascending: false })

  setNotes(data || [])
}

useEffect(() => {
  fetchNotes()
}, [noteDate])


useEffect(() => {
  const getSession = async () => {
    const { data } = await supabase.auth.getSession()
    setSession(data.session)
    setLoading(false)
  }

  getSession()

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
  })

  return () => {
    listener.subscription.unsubscribe()
  }
}, [])
useEffect(() => {
  const today = new Date().toISOString().split('T')[0]
  setNoteDate(today)
}, [])


async function signIn() {
  console.log("SIGN IN CLICKED")

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  console.log("RESULT:", data, error)

  if (error) {
    console.log("ERROR:", error)
  } else {
    console.log("SETTING SESSION")
    setSession(data.session)
  }
}
async function signUp() {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    console.log(error)
  } else {
    setSession(data.session)
  }
}
async function addNote() {
  if (!noteText) return

  await supabase.from('dailynotes').insert([
    {
      note: noteText,
      spec: spec || null,
      task_id: taskId ? Number(taskId) : null
    }
  ])

  setNoteText('')
  setSpec('')
  setTaskId('')
  fetchNotes()
}
  async function fetchTasks() {
    const { data } = await supabase.from('tasks').select('*')
    setTasks(data || [])
  }


 async function addTask() {
  if (!newTask) return

  await supabase.from('tasks').insert([
    {
      title: newTask,
      completed: false,
      due_date: dueDate || null,
      status: status || null
    }
  ])

  setNewTask('')
  setDueDate('')
  setStatus('')
  fetchTasks()
}
async function updateDueDate(id: number, newDate: string) {
  await supabase
    .from('tasks')
    .update({ due_date: newDate || null })
    .eq('id', id)

  fetchTasks()
}
function updateLocalTask(id, field, value) {
  setTasks(prev =>
    prev.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    )
  )
}
 
function setTodayToTomorrow() {
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const format = (d: Date) => d.toISOString().split('T')[0]

  setFromDate(format(today))
  setToDate(format(tomorrow))
}

async function updateTask(task) {
  await supabase
    .from('tasks')
    .update({
      due_date: task.due_date || null,
      status: task.status || null,
      completed_date: task.completed_date || null
    })
    .eq('id', task.id)

  fetchTasks()
}
async function toggleTask(id: number, completed: boolean) {
  await supabase
    .from('tasks')
    .update({ completed: !completed })
    .eq('id', id)

  fetchTasks()
}

  async function deleteTask(id: number) {
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  useEffect(() => {
    fetchTasks()
  }, [])

const filteredTasks = tasks.filter(task => {
  if (filter === 'active') return !task.completed
  if (filter === 'completed') return task.completed

  // DATE RANGE FILTER
  if (fromDate && (!task.due_date || task.due_date < fromDate)) return false
  if (toDate && (!task.due_date || task.due_date > toDate)) return false

  return true
})
if (loading) {
  return <div className="p-4">Loading...</div>
}
if (!session) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md flex flex-col gap-2">

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="border px-2 py-1"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="border px-2 py-1"
        />

        <button onClick={signIn} className="bg-blue-500 text-white px-2 py-1">
          Login
        </button>

        <button onClick={signUp} className="bg-gray-300 px-2 py-1">
          Sign Up
        </button>

      </div>
    </main>
  )
}
 return (
  
<main className="min-h-screen bg-gray-100 flex justify-center items-start p-6">

  <div className="flex w-full max-w-6xl gap-6">

    {/* LEFT PANEL — TASK TRACKER */}
    <div className="w-1/2">
      <div className="bg-white rounded-xl shadow-md w-full h-[800px] flex flex-col">

        {/* HEADER */}
        <div className="bg-purple-500 text-white  rounded-t-xl px-4 py-2">
          <h1 className="text-lg font-bold text-center">
            Task Tracker<div className="flex justify-between items-center mb-4">
  <h1 className="text-xl font-bold">
    Recipe App 🍳
  </h1>

  <button
    onClick={signOut}
    className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
  >
    Logout
  </button>
</div>
          </h1>
        </div>

        {/* CONTENT */}
        <div className="p-6">

          {/* ==== YOUR EXISTING TRACKER STARTS HERE ==== */}

          <div className="flex gap-2 mb-4">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 border rounded-md px-2 py-1 text-xs"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 border rounded-md px-2 py-1 text-xs"
            />

            <input
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Status"
              className="flex-1 border rounded-md px-2 py-1 text-xs"
            />

            <button
              onClick={addTask}
              className="bg-white text-purple-600 w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:shadow-lg active:scale-95 transition"
            >
              +
            </button>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-lg ${
                filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Active
            </button>

            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-lg ${
                filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>

          <div className="flex items-center gap-2 mb-3 text-xs">
            <span>From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded px-1 py-0.5"
            />

            <span>To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded px-1 py-0.5"
            />

            <button
              onClick={setTodayToTomorrow}
              className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              Today → Tomorrow
            </button>
          </div>

          {/* HEADER ROW */}
          <div className="flex items-center px-2 mb-2 text-xs font-semibold text-gray-500">
            <span className="w-32">Task</span>
            <span className="w-36">Due Date</span>
            <span className="w-40">Status</span>
            <span className="w-36">Completed</span>
            <span className="w-24 text-right ml-auto">Actions</span>
          </div>

          {/* TASK LIST */}
          <ul className="space-y-1">
            {filteredTasks.map(task => (
              <li
                key={task.id}
                className="flex items-center bg-gray-50 px-2 py-1 rounded-md hover:bg-gray-100"
              >

                <div
  className="w-32 text-xs cursor-pointer hover:underline hover:text-purple-600"
  onClick={() => {
    console.log('clicked task', task.id)
    createNoteFromTask(task)
  }}
>
  {task.title}
</div>

                <div className="w-36">
                  <input
                    type="date"
                    value={task.due_date || ''}
                    onChange={(e) =>
                      updateLocalTask(task.id, 'due_date', e.target.value)
                    }
                    className="text-xs bg-transparent"
                  />
                </div>

                <div className="w-40">
                  <input
                    value={task.status || ''}
                    onChange={(e) =>
                      updateLocalTask(task.id, 'status', e.target.value)
                    }
                    className="text-xs bg-transparent"
                  />
                </div>

                <div className="w-36">
                  <input
                    type="date"
                    value={task.completed_date || ''}
                    onChange={(e) =>
                      updateLocalTask(task.id, 'completed_date', e.target.value)
                    }
                    className="text-xs bg-transparent"
                  />
                </div>

                <div className="w-24 flex justify-end gap-1">
                  <button onClick={() => updateTask(task)} className="text-sm">
                    💾
                  </button>

                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`text-sm ${
                      task.completed ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    👍
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 text-sm"
                  >
                    ✕
                  </button>
                </div>

              </li>
            ))}
          </ul>

          {/* ==== YOUR EXISTING TRACKER ENDS HERE ==== */}

        </div>
      </div>
    </div>

    {/* RIGHT PANEL — MONTH VIEW */}
    <div className="w-1/2">
      <div className="bg-white rounded-xl shadow-md w-full h-[800px] flex flex-col">
            
        <div className="bg-purple-500 text-white px-4 py-2  rounded-t-xl">
          <h1 className="text-lg font-bold text-center">
            Notes
          </h1>
        </div>
        <div className="flex items-center justify-between mb-3">

  {/* LEFT ARROW */}
  <button
    onClick={goToPreviousDay}
    className="text-gray-500 hover:text-black text-lg px-2"
  >
    ←
  </button>

  {/* DATE */}
  <div className="text-lg font-semibold text-gray-700 text-center">
    {noteDate &&
      new Date(noteDate).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
  </div>

  {/* RIGHT ARROW */}
  <button
    onClick={goToNextDay}
    className="text-gray-500 hover:text-black text-lg px-2"
  >
    →
  </button>

</div>

        <div className="p-6 text-center text-gray-500 text-sm">
          <div className="p-6">

  {/* DATE SELECT */}
  <input
    type="date"
    value={noteDate}
    onChange={(e) => setNoteDate(e.target.value)}
    className="border rounded px-2 py-1 text-xs mb-3"
  />

  {/* INPUT ROW */}
  <div className="flex gap-2 mb-4">
    <input
      value={noteText}
      onChange={(e) => setNoteText(e.target.value)}
      placeholder="Write note..."
      className="flex-1 border rounded px-2 py-1 text-xs"
    />

    <input
      value={spec}
      onChange={(e) => setSpec(e.target.value)}
      placeholder="spec"
      className="w-20 border rounded px-2 py-1 text-xs"
    />

    <input
      value={taskId}
      onChange={(e) => setTaskId(e.target.value)}
      placeholder="task"
      className="w-16 border rounded px-2 py-1 text-xs"
    />

    <button
      onClick={addNote}
      className="bg-white text-purple-600 w-8 h-8 flex items-center justify-center rounded-full shadow-md"
    >
      +
    </button>
  </div>

  {/* NOTES LIST */}
  <div className="space-y-1 text-xs">
    {notes.map(note => (
      <div key={note.id} className="bg-gray-50 px-2 py-1 rounded">

        <div>{note.note}</div>

        <div className="text-gray-400 flex gap-2">
          {note.spec && <span>#{note.spec}</span>}
          {note.task_id && <span>task:{note.task_id}</span>}
        </div>

      </div>
    ))}
  </div>

</div>
        </div>

      </div>
    </div>

  </div>

</main>)
}