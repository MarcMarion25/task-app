'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

const headerStyle = (color: string) => ({
  background: color,
  color: 'white',
  padding: '10px 12px',
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  fontWeight: 600,
})

// TYPES
type Task = {
  id: string
  title: string
  due_date: string | null
  status: string | null
  completed: boolean
  comp_date: string | null
}

// MAIN PAGE
export default function Home() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Task App</h1>





       <div style={styles.cards}>
  <div style={{ ...twoThirds, marginBottom: 20 }}>
    <TasksCard />
  </div>
<div style={{ ...twoThirds, marginBottom: 20 }}>
  <NotesCard />
  </div>
  <div style={{ ...twoThirds, marginBottom: 20 }}>
  <IntentionsCard /></div>
  <div style={{ ...twoThirds, marginBottom: 20 }}>
  <DayRatingCard />
</div>
<div style={{ ...twoThirds, marginBottom: 20 }}>
   
    <CompletedTasksCard />
  </div>

<div style={{ ...twoThirds, marginBottom: 20 }}>
<HabitsCard />
</div>  
</div>

      </div>
    </div>
  )
}
// TASKS CARD
function TasksCard() {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // EDIT STATE
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editDueDate, setEditDueDate] = useState('')

  // FETCH TASKS
  const fetchTasks = async () => {
    let query = supabase
  .from('tasks')
  .select('*')
  .eq('completed', false)   // ✅ ONLY open tasks
  .order('due_date')

    if (startDate) query = query.gte('due_date', startDate)
    if (endDate) query = query.lte('due_date', endDate)

    const { data } = await query
    if (data) setTasks(data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // ADD
  const addTask = async () => {
    if (!title) return

    await supabase.from('tasks').insert([
      { title, due_date: dueDate || null, status },
    ])

    setTitle('')
    setDueDate('')
    setStatus('')
    fetchTasks()
  }

  // COMPLETE
const toggleComplete = async (task: Task) => {
  const isCompleting = !task.completed

  await supabase
    .from('tasks')
    .update({
      completed: isCompleting,
      comp_date: isCompleting
        ? new Date().toISOString().split('T')[0] // ✅ store date only
        : null,
    })
    .eq('id', task.id)

  fetchTasks()           // refresh open tasks
  window.location.reload()
  // we'll also refresh completed below
}
  // EDIT
  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditStatus(task.status || '')
    setEditDueDate(task.due_date || '')
  }

  const saveEdit = async (id: string) => {
    await supabase
      .from('tasks')
      .update({
        title: editTitle,
        status: editStatus,
        due_date: editDueDate || null,
      })
      .eq('id', id)

    setEditingId(null)
    fetchTasks()
  }

  return (
    <div style={card}>
      
        <div style={headerStyle('#16a34a')}>Tasks
       
          
          </div>
    
      {/* ADD */}
      <div style={{ padding: '12px 16px' }}>
      <div style={row}>
        <input
          style={input}
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={smallInput}
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <input
          style={smallInput}
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <button style={addBtn} onClick={addTask}>+</button>
      </div></div>


      {/* FILTER */}
       <div style={{ padding: '12px 16px' }}>
      <div style={row}>
        <input
          style={smallInput}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          style={smallInput}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button style={filterBtn} onClick={fetchTasks}>Filter</button>
      </div>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 10 }}>
        {tasks.map((task) => (
          <div key={task.id} style={taskRow}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />

            {editingId === task.id ? (
              <>
                <input
                  style={input}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  style={smallInput}
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
                <input
                  style={smallInput}
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                />
                <button style={filterBtn} onClick={() => saveEdit(task.id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span style={{ flex: 2 }}>
                  <strong>{task.title}</strong>
                </span>
                <span style={{ flex: 1 }}>{task.due_date || '-'}</span>
                <span style={{ flex: 1 }}>{task.status || '-'}</span>
                <button style={editBtn} onClick={() => startEdit(task)}>
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
    
  )
}

// NOTES
function NotesCard() {
  const [noteDate, setNoteDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [note, setNote] = useState('')

  const fetchNote = async (date: string) => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('note_date', date)
      .single()

    if (data) setNote(data.note)
    else setNote('')
  }

  useEffect(() => {
    fetchNote(noteDate)
  }, [noteDate])

  const saveNote = async () => {
    await supabase.from('notes').upsert(
      { note_date: noteDate, note },
      { onConflict: 'note_date' }
    )
  }

  return (
   <div style={card}>
  <div style={headerStyle('#9333ea')}>Notes</div>

  <div style={{ padding: 12 }}>
    {/* DATE AT TOP */}
    <div style={{ marginBottom: 10 }}>
      <input
        style={smallInput}
        type="date"
        value={noteDate}
        onChange={(e) => setNoteDate(e.target.value)}
      />
    </div>

    {/* FULL WIDTH TEXT AREA */}
    <textarea
      style={{
        width: '100%',
        height: 200,
        padding: 10,
        borderRadius: 8,
        border: '1px solid #ccc',
        resize: 'vertical',
      }}
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Write your notes..."
    />

    <button style={filterBtn} onClick={saveNote}>
      Save
    </button>
  </div>
</div>
  )
}

function IntentionsCard() {
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [text, setText] = useState('')
  const [recent, setRecent] = useState<any[]>([])

  // load today's intention + last 5
  const fetchIntentions = async () => {
    // today
    const { data: today } = await supabase
      .from('intentions')
      .select('*')
      .eq('intention_date', date)
      .single()

    if (today) setText(today.text)
    else setText('')

    // last 5 days
    const { data } = await supabase
      .from('intentions')
      .select('*')
      .order('intention_date', { ascending: false })
      .limit(5)

    if (data) setRecent(data)
  }

  useEffect(() => {
    fetchIntentions()
  }, [date])

  const save = async () => {
    await supabase.from('intentions').upsert(
      {
        intention_date: date,
        text,
      },
      { onConflict: 'intention_date' }
    )

    fetchIntentions()
  }




  
  return (
    <div style={card}>
  <div style={headerStyle('#f97316')}>Intention</div>

  <div style={{ padding: 12 }}>
    {/* DATE AT TOP */}
    <div style={{ marginBottom: 10 }}>
      <input
        style={smallInput}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>

    {/* LABEL */}
    <div style={{ marginBottom: 6, fontWeight: 500 }}>
      Today I ..will.
    </div>

    {/* FULL WIDTH TEXT */}
    <textarea
      style={{
        width: '100%',
        height: 120,
        padding: 10,
        borderRadius: 8,
        border: '1px solid #ccc',
        resize: 'vertical',
      }}
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Today I will."
    />

    <button style={filterBtn} onClick={save}>
      Save
    </button>

    {/* LAST 5 DAYS */}
    <div style={{ marginTop: 20 }}>
      <h4>Last 5 Days</h4>

      {recent.map((item) => (
        <div key={item.id} style={taskRow}>
          <div style={{ width: 100 }}>
            {item.intention_date}
          </div>
          <div>{item.text}</div>
        </div>
      ))}
    </div>
  </div>
</div>
  )
}

function DayRatingCard() {
  const [recent, setRecent] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [text, setText] = useState('')
  const [rating, setRating] = useState<number | null>(null)

  const emojis = ['😞', '😐', '🙂', '😊', '😄']

  const fetchRating = async () => {
  // current day
  const { data } = await supabase
    .from('day_ratings')
    .select('*')
    .eq('rating_date', date)
    .single()

  if (data) {
    setText(data.what_went_well || '')
    setRating(data.rating)
  } else {
    setText('')
    setRating(null)
  }

  // last 5 days
  const { data: recentData } = await supabase
    .from('day_ratings')
    .select('*')
    .order('rating_date', { ascending: false })
    .limit(5)

  if (recentData) setRecent(recentData)

    const { data: chart } = await supabase
  .from('day_ratings')
  .select('*')
  .order('rating_date', { ascending: true })
  .limit(10)

if (chart) setChartData(chart)
}
  useEffect(() => {
    fetchRating()
  }, [date])

  const save = async () => {
    await supabase.from('day_ratings').upsert(
      {
        rating_date: date,
        what_went_well: text,
        rating,
      },
      { onConflict: 'rating_date' }
    )
  }

  return (
  <div style={card}>
  <div style={headerStyle('#3b82f6')}>Rate the Day</div>

  <div style={{ padding: 12 }}>
    {/* DATE AT TOP */}
    <div style={{ marginBottom: 10 }}>
      <input
        style={smallInput}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>

    {/* TEXT */}
    <div style={{ marginBottom: 6, fontWeight: 500 }}>
      What went well
    </div>

    <textarea
      style={{
        width: '100%',
        height: 120,
        padding: 10,
        borderRadius: 8,
        border: '1px solid #ccc',
        resize: 'vertical',
      }}
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="What went well..."
    />

    {/* RATING */}
    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
      {emojis.map((emoji, i) => (
        <button
          key={i}
          onClick={() => setRating(i + 1)}
          style={{
            fontSize: 24,
            padding: 6,
            borderRadius: 6,
            border:
              rating === i + 1
                ? '2px solid #3b82f6'
                : '1px solid #ccc',
            background: 'white',
            cursor: 'pointer',
          }}
        >
          {emoji}
        </button>
      ))}
    </div>

    <button style={filterBtn} onClick={save}>
      Save
    </button>
    <div style={{ marginTop: 20 }}>
  <h4>Last 5 Days</h4>

  {recent.map((item) => (
    <div key={item.id} style={taskRow}>
      <div style={{ width: 100 }}>
        {item.rating_date}
      </div>

      <div style={{ width: 50 }}>
        {['😞','😐','🙂','😊','😄'][item.rating - 1]}
      </div>

      <div>{item.what_went_well}</div>
    </div>
  ))}
</div>
  </div>
</div>  )
}


function CompletedTasksCard() {
  const today = new Date()
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(today.getDate() - 2)

  const format = (d: Date) => d.toISOString().split('T')[0]

  const [startDate, setStartDate] = useState(format(twoDaysAgo))
  const [endDate, setEndDate] = useState(format(today))
  const [tasks, setTasks] = useState<any[]>([])

  const fetchCompleted = async () => {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('completed', true)
      .order('comp_date', { ascending: false })

    if (startDate) query = query.gte('comp_date', startDate)
    if (endDate) query = query.lte('comp_date', endDate)

    const { data } = await query
    if (data) setTasks(data)
  }

  useEffect(() => {
  fetchCompleted()
}, [startDate, endDate])

  return (
    <div style={card}>
      <div style={headerStyle('#0ea5e9')}><h2>Completed Tasks</h2>
       
          </div>
      

      {/* Filter */}
      <div style={row }>
        <div style={{ padding: '12px 16px' }}>
        <input
          style={smallInput}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          style={smallInput}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button style={filterBtn} onClick={fetchCompleted}>
          Filter
        </button>
      </div>
      </div>
      

      {/* List */}
      <div style={{ padding: '12px 16px' }}>
        
      <div style={{ marginTop: 10 }}>
        {tasks.length === 0 && <div>No completed tasks</div>}

        {tasks.map((task) => (
          <div key={task.id} style={taskRow}>
            <span style={{ flex: 2 }}>
              <strong>{task.title}</strong>
            </span>

            <span style={{ flex: 1 }}>
              {task.comp_date || '-'}
            </span>

            <span style={{ flex: 1 }}>
              {task.status || '-'}
            </span>
          </div>
        ))}
      </div></div>
      
    </div>
  )
}

// STYLES
const styles = {
  page: {
    background: '#e5e7eb',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 40,
  },

container: {
  background: '#f3f4f6',
  padding: 20,
  width: '100%',
  maxWidth: 1100,      // ~2/3 feel but responsive
  margin: '0 auto',
},
  title: {
    textAlign: 'center' as const,
    marginBottom: 20,
  },
cards: {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)', // ✅ force 3 columns
  gap: 20,
},
}

function HabitsCard() {
  
  
const deleteHabit = async (id: string) => {
  await supabase.from('habits').delete().eq('id', id)

  fetchHabits()
}


  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const weekday = today.getDay()

  const [habits, setHabits] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [newHabit, setNewHabit] = useState('')

  const [frequencyType, setFrequencyType] = useState('daily')
  const [intervalDays, setIntervalDays] = useState(3)
  const [habitWeekday, setHabitWeekday] = useState(6)

  const fetchHabits = async () => {
    const { data } = await supabase.from('habits').select('*')
    if (data) setHabits(data)

    const { data: logData } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('log_date', todayStr)

    if (logData) setLogs(logData)
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  const isDueToday = (habit: any) => {
    if (habit.frequency_type === 'daily') return true

    if (habit.frequency_type === 'weekly') {
      return habit.weekday === weekday
    }

    if (habit.frequency_type === 'interval') {
      const start = new Date(habit.start_date)
      const diff = Math.floor(
        (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      )
      return diff % habit.interval_days === 0
    }

    return false
  }

 


 const isCompleted = (habitId: string) => {
  return logs.some((l) => l.habit_id === habitId)
}
const dueHabits = habits.filter(isDueToday)

const allCompleted =
  dueHabits.length > 0 &&
  dueHabits.every((h) => isCompleted(h.id))  
  const toggleHabit = async (habitId: string) => {
    const exists = logs.find((l) => l.habit_id === habitId)

    if (exists) {
      await supabase.from('habit_logs').delete().eq('id', exists.id)
    } else {
      await supabase.from('habit_logs').insert([
        { habit_id: habitId, log_date: todayStr },
      ])
    }

    fetchHabits()
  }

  const addHabit = async () => {
    if (!newHabit) return

    await supabase.from('habits').insert([
      {
        name: newHabit,
        frequency_type: frequencyType,
        interval_days:
          frequencyType === 'interval' ? intervalDays : null,
        weekday:
          frequencyType === 'weekly' ? habitWeekday : null,
        start_date: todayStr,
      },
    ])

    setNewHabit('')
    fetchHabits()
  }

  return (
  <div style={card}>
    <div style={headerStyle('#22c55e')}>Habits</div>

    <div style={{ padding: 12 }}>
    {allCompleted ? (
  <Celebration />
) : (
  <>
          {/* ADD */}
          <div style={{ marginTop: 10 }}>
            <input
              style={input}
              placeholder="New habit"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
            />

            <div style={{ marginTop: 8 }}>
              <select
                value={frequencyType}
                onChange={(e) => setFrequencyType(e.target.value)}
                style={smallInput}
              >
                <option value="daily">Daily</option>
                <option value="interval">Every X Days</option>
                <option value="weekly">Specific Day</option>
              </select>
            </div>

            {frequencyType === 'interval' && (
              <div style={{ marginTop: 8 }}>
                <input
                  type="number"
                  min="1"
                  value={intervalDays}
                  onChange={(e) =>
                    setIntervalDays(Number(e.target.value))
                  }
                  style={smallInput}
                />
                <span style={{ marginLeft: 6 }}>days</span>
              </div>
            )}

            {frequencyType === 'weekly' && (
              <div style={{ marginTop: 8 }}>
                <select
                  value={habitWeekday}
                  onChange={(e) =>
                    setHabitWeekday(Number(e.target.value))
                  }
                  style={smallInput}
                >
                  <option value={0}>Sunday</option>
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                </select>
              </div>
            )}

            <button style={addBtn} onClick={addHabit}>
              Add Habit
            </button>
          </div>

          {/* LIST */}
          <div style={{ marginTop: 10 }}>
            {dueHabits.map((habit) => (
              <div key={habit.id} style={taskRow}>
                <input
                  type="checkbox"
                  checked={isCompleted(habit.id)}
                  onChange={() => toggleHabit(habit.id)}
                />

                <span style={{ flex: 1 }}>{habit.name}</span>

                <button
                  style={deleteBtn}
                  onClick={() => deleteHabit(habit.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
)

}

function Celebration() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 20,
        position: 'relative',
      }}
    >
      {/* Firework Image */}
      <img
        src="/fireworks.gif"
        alt="celebration"
        style={{
          width: 200,
          height: 200,
          objectFit: 'contain',
          animation: 'pop 0.6s ease-out',
        }}
      />

      {/* Text */}
      <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600 }}>
        All habits complete! 🔥
      </div>

      <div style={{ fontSize: 14, color: '#6b7280' }}>
        Strong finish today
      </div>
    </div>
  )
}

const twoThirds = {
  gridColumn: 'span 3', // ✅ takes 2 out of 3 columns
}
 const card = {
  border: '1px solid #ddd',
  borderRadius: 12,
  background: '#fff',
  overflow: 'hidden',
 boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
}

const row = {
  display: 'flex',
  gap: 8,
  marginTop: 10,
}

const input = {
  flex: 1,
  padding: 8,
  borderRadius: 6,
  border: '1px solid #ccc',
}
const deleteBtn = {
  background: '#ef4444',
  color: 'white',
  border: 'none',
  padding: '4px 8px',
  borderRadius: 6,
  cursor: 'pointer',
}

const smallInput = {
  width: 120,
  padding: 8,
  borderRadius: 6,
  border: '1px solid #ccc',
}

const addBtn = {
  background: '#22c55e',
  color: 'white',
  border: 'none',
  padding: '0 12px',
  borderRadius: 6,
}

const filterBtn = {
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 6,
  marginTop: 10,
}

const editBtn = {
  background: '#f59e0b',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: 6,
}

const taskRow = {
  display: 'flex',
  gap: 10,
  padding: 8,
  border: '1px solid #eee',
  borderRadius: 6,
  marginTop: 6,
}