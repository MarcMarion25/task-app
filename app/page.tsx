'use client'

import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

/* ================= STYLES ================= */

const card = {
  border: '1px solid #e5e7eb',
  borderRadius: 6,
  background: 'white',
}

const headerStyle = (color: string) => ({
  background: color,
  color: 'white',
  padding: '6px 10px',
  fontWeight: 600,
})

const input = {
  border: '1px solid #ccc',
  padding: 6,
  borderRadius: 6,
}

const smallInput = {
  ...input,
  width: 120,
}

const addBtn = {
  background: '#16a34a',
  color: 'white',
  padding: '6px 10px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
}

/* ================= PROJECTS ================= */

function ProjectsCard() {
  const [projects, setProjects] = useState<any[]>([])
  const [showCompleted, setShowCompleted] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})

  const [name, setName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [nextStep, setNextStep] = useState('')
  const [percent, setPercent] = useState(0)
  const [atBat, setAtBat] = useState('')

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('due_date')
    if (data) setProjects(data)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const addProject = async () => {
    if (!name) return

    await supabase.from('projects').insert([
      { name, due_date: dueDate || null, next_step: nextStep, percent_done: percent, at_bat: atBat },
    ])

    setName('')
    setDueDate('')
    setNextStep('')
    setPercent(0)
    setAtBat('')
    fetchProjects()
  }

  const startEdit = (p: any) => {
    setEditingId(p.id)
    setEditData({ ...p })
  }

  const saveEdit = async () => {
    await supabase
      .from('projects')
      .update({
        name: editData.name,
        due_date: editData.due_date,
        next_step: editData.next_step,
        percent_done: editData.percent_done,
        at_bat: editData.at_bat,
      })
      .eq('id', editingId)

    setEditingId(null)
    fetchProjects()
  }

  return (
    <div style={card}>
      <div style={headerStyle('#0ea5e9')}>Projects</div>

      <div style={{ padding: 12 }}>

        {/* ADD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input style={input} placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
          <input style={smallInput} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <input style={input} placeholder="Next step" value={nextStep} onChange={(e) => setNextStep(e.target.value)} />
          <input style={smallInput} type="number" value={percent} onChange={(e) => setPercent(Number(e.target.value))} />
          <input style={smallInput} placeholder="At bat" value={atBat} onChange={(e) => setAtBat(e.target.value)} />
          <button style={addBtn} onClick={addProject}>Add Project</button>
        </div>

        {/* TOGGLE */}
        <button
          onClick={() => setShowCompleted((p) => !p)}
          style={{ marginTop: 10, padding: 4 }}
        >
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>

        {/* LIST */}
        <div style={{ marginTop: 12 }}>
          {projects
            .filter((p) => showCompleted || (p.percent_done ?? 0) < 100)
            .map((p) => (
              <div key={p.id} style={{ display: 'flex', gap: 10, padding: 6 }}>

                <div style={{ flex: 2 }}>
                  {editingId === p.id ? (
                    <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                  ) : (
                    <span onClick={() => startEdit(p)}>{p.name}</span>
                  )}
                </div>

                <div>
                  {editingId === p.id ? (
                    <input type="date" value={editData.due_date || ''} onChange={(e) => setEditData({ ...editData, due_date: e.target.value })} />
                  ) : p.due_date}
                </div>

                <div style={{ flex: 2 }}>
                  {editingId === p.id ? (
                    <input value={editData.next_step || ''} onChange={(e) => setEditData({ ...editData, next_step: e.target.value })} />
                  ) : p.next_step}
                </div>

                <div>
                  {editingId === p.id ? (
                    <input type="number" value={editData.percent_done || 0} onChange={(e) => setEditData({ ...editData, percent_done: Number(e.target.value) })} />
                  ) : `${p.percent_done || 0}%`}
                </div>

                <div>
                  {editingId === p.id ? (
                    <input value={editData.at_bat || ''} onChange={(e) => setEditData({ ...editData, at_bat: e.target.value })} />
                  ) : p.at_bat}
                </div>

                <button onClick={editingId === p.id ? saveEdit : () => startEdit(p)}>
                  {editingId === p.id ? 'Save' : 'Edit'}
                </button>

              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

/* ================= IDEAS ================= */

function IdeasCard() {
  const [ideas, setIdeas] = useState<any[]>([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchIdeas = async () => {
    const { data } = await supabase.from('ideas').select('*').order('created_at', { ascending: false })
    if (data) setIdeas(data)
  }

  useEffect(() => {
    fetchIdeas()
  }, [])

  const addIdea = async () => {
    if (!name) return
    await supabase.from('ideas').insert([{ name, category, note }])
    setName('')
    setCategory('')
    setNote('')
    fetchIdeas()
  }

  const deleteIdea = async (id: string) => {
    await supabase.from('ideas').delete().eq('id', id)
    fetchIdeas()
  }

  const filtered =
    filter === 'all'
      ? ideas
      : ideas.filter((i) => (i.category || '').toLowerCase() === filter)

  return (
    <div style={card}>
      <div style={headerStyle('#f59e0b')}>Ideas</div>

      <div style={{ padding: 12 }}>

        <input placeholder="Idea" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input placeholder="Notes" value={note} onChange={(e) => setNote(e.target.value)} />
        <button onClick={addIdea}>Add</button>

        <div style={{ marginTop: 10 }}>
          {['all', 'restaurant', 'gift', 'book'].map((c) => (
            <button key={c} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>

        <div style={{ marginTop: 10 }}>
          {filtered.map((i) => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div>{i.name}</div>
                <div style={{ fontSize: 12 }}>{i.category}</div>
              </div>
              <button onClick={() => deleteIdea(i.id)}>X</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

/* ================= PAGE ================= */

export default function Home() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 20,
        padding: 20,
      }}
    >
      <ProjectsCard />
      <IdeasCard />
    </div>
  )
}
