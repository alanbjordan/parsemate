import React, { useRef, useState } from 'react'
import { Paper, Typography, Box, Button, Alert } from '@mui/material'
import UploadModal from './UploadModal'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
const MAX_SIZE_MB = 5

function Upload() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const fileInputRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Only PNG, JPG, JPEG, or PDF files are allowed.')
      setFile(null)
      return
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError('File size must be under 5MB.')
      setFile(null)
      return
    }
    setError('')
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files[0]
    handleFile(droppedFile)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    handleFile(selectedFile)
  }

  const handlePickFile = () => {
    fileInputRef.current.click()
  }

  const handlePreviewClick = () => {
    setModalOpen(true)
  }

  const renderPreview = () => {
    if (!file) return null
    if (file.type.startsWith('image/')) {
      return (
        <Box mt={2}>
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, cursor: 'pointer' }}
            onClick={handlePreviewClick}
          />
        </Box>
      )
    } else if (file.type === 'application/pdf') {
      return (
        <Box mt={2}>
          <embed
            src={URL.createObjectURL(file)}
            type="application/pdf"
            width="200px"
            height="200px"
            style={{ cursor: 'pointer' }}
            onClick={handlePreviewClick}
          />
        </Box>
      )
    }
    return null
  }

  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" mb={2}>Upload Receipt</Typography>
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: '2px dashed #1976d2',
          borderRadius: 2,
          p: 4,
          mb: 2,
          cursor: 'pointer',
          bgcolor: '#f5f5f5',
        }}
        onClick={handlePickFile}
      >
        <Typography color="text.secondary">
          Drag & drop an image or PDF here, or click to select a file
        </Typography>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, application/pdf"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Box>
      <Button variant="contained" onClick={handlePickFile} sx={{ mb: 2 }}>
        Choose File
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {renderPreview()}
      {file && (
        <Typography variant="body2" mt={2} color="text.secondary">
          Selected: {file.name}
        </Typography>
      )}
      <UploadModal open={modalOpen} onClose={() => setModalOpen(false)} file={file} />
    </Paper>
  )
}

export default Upload 