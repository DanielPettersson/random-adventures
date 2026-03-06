import React, { useState } from 'react'

interface PromptInputProps {
  onSubmit: (prompt: string) => void
  disabled: boolean
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, disabled }) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value)
      setValue('')
    }
  }

  return (
    <form className="prompt-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your next move..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        Send
      </button>
    </form>
  )
}

export default PromptInput
