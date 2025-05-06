import React, { useRef, useState } from 'react'
import { Paper, Typography, Box, Button, Alert, IconButton, Grid, CircularProgress } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadModal from './UploadModal'
import { uploadFile } from '../../services/api'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
const MAX_SIZE_MB = 5

function Upload({ onUploadSuccess, onNext }) {
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalFile, setModalFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef()

  const validateFile = (f) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return 'Only PNG, JPG, JPEG, or PDF files are allowed.'
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return 'File size must be under 5MB.'
    }
    return null
  }

  const handleFiles = (fileList) => {
    let newFiles = []
    let err = ''
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i]
      const validation = validateFile(f)
      if (validation) {
        err = validation
        continue
      }
      if (!files.some(existing => existing.name === f.name && existing.size === f.size)) {
        newFiles.push(f)
      }
    }
    if (err) setError(err)
    else setError('')
    setFiles(prev => [...prev, ...newFiles])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleFileChange = (e) => {
    handleFiles(e.target.files)
  }

  const handlePickFile = () => {
    fileInputRef.current.value = null
    fileInputRef.current.click()
  }

  const handleRemoveFile = (idx) => {
    setFiles(files => files.filter((_, i) => i !== idx))
  }

  const handleClearAll = () => {
    setFiles([])
    setError('')
    setSuccess('')
  }

  const handlePreviewClick = (file) => {
    setModalFile(file)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    if (files.length === 0) {
      setError('Please select a file to upload.')
      return
    }
    setLoading(true)
    try {
      const parsedData = await uploadFile(files[0])
      setSuccess('File uploaded and parsed successfully!')
      setFiles([])
      if (onUploadSuccess) onUploadSuccess(parsedData)
      if (onNext) onNext()
    } catch (err) {
      setError(err.message || 'Upload failed.')
    }
    setLoading(false)
  }

  const renderPreview = (file, idx) => {
    if (file.type.startsWith('image/')) {
      return (
        <Box key={file.name + idx} sx={{ textAlign: 'center' }}>
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{ maxWidth: 100, maxHeight: 100, borderRadius: 8, cursor: 'pointer' }}
            onClick={() => handlePreviewClick(file)}
          />
          <IconButton size="small" onClick={() => handleRemoveFile(idx)}><DeleteIcon /></IconButton>
          <Typography variant="body2" noWrap>{file.name}</Typography>
        </Box>
      )
    } else if (file.type === 'application/pdf') {
      return (
        <Box key={file.name + idx} sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              bgcolor: '#eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              cursor: 'pointer',
              mb: 1,
            }}
            onClick={() => handlePreviewClick(file)}
          >
            <Typography variant="h3" color="primary">PDF</Typography>
          </Box>
          <IconButton size="small" onClick={() => handleRemoveFile(idx)}><DeleteIcon /></IconButton>
          <Typography variant="body2" noWrap>{file.name}</Typography>
        </Box>
      )
    }
    return null
  }

  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" mb={2}>Upload Receipts</Typography>
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        sx={{
          border: dragActive ? '2px solid #1976d2' : '2px dashed #1976d2',
          borderRadius: 2,
          p: 4,
          mb: 2,
          cursor: 'pointer',
          bgcolor: dragActive ? '#e3f2fd' : '#f5f5f5',
          transition: 'border 0.2s, background 0.2s',
        }}
        onClick={handlePickFile}
      >
        <Typography color="text.secondary">
          Drag & drop images or PDFs here, or click to select files
        </Typography>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, application/pdf"
          multiple
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Allowed types: PNG, JPG, JPEG, PDF. Max size: {MAX_SIZE_MB}MB per file.
      </Typography>
      <Button variant="contained" onClick={handlePickFile} sx={{ mb: 2, mr: 2 }}>
        Choose Files
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleClearAll} sx={{ mb: 2 }} disabled={files.length === 0}>
        Clear All
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit}
        sx={{ mb: 2, ml: 2 }}
        disabled={files.length === 0 || loading}
      >
        {loading ? <><CircularProgress size={20} sx={{ mr: 1 }} /> Uploading...</> : 'Submit'}
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        {files.map((file, idx) => (
          <Grid item key={file.name + idx}>
            {renderPreview(file, idx)}
          </Grid>
        ))}
      </Grid>
      <UploadModal open={modalOpen} onClose={() => setModalOpen(false)} file={modalFile} />
    </Paper>
  )
}

export default Upload
