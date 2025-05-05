import React from 'react'
import { Dialog, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

function UploadModal({ open, onClose, file }) {
  if (!file) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        {file.type.startsWith('image/') ? (
          <img
            src={URL.createObjectURL(file)}
            alt="preview-large"
            style={{ maxWidth: '80vw', maxHeight: '70vh', borderRadius: 8 }}
          />
        ) : file.type === 'application/pdf' ? (
          <embed
            src={URL.createObjectURL(file)}
            type="application/pdf"
            width="600px"
            height="600px"
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export default UploadModal 