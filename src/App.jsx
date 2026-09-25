import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import axiosClient from './api/axiosClient'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = 'image/*,audio/*,video/*,.pdf'

function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.7 6.3 3-3a5 5 0 0 0-6.2 6.2l-7.2 7.2a2.1 2.1 0 1 0 3 3l7.2-7.2a5 5 0 0 0 6.2-6.2l-3 3-3-3Z" />
      <circle
        cx="5.9"
        cy="18.1"
        r=".7"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m20.5 11.5-8.3 8.3a5 5 0 0 1-7.1-7.1l8.5-8.5a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-2.8-2.8l7.8-7.8" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 1.1 4.2A4 4 0 0 0 16 10l4 1.1-4 1.2a4 4 0 0 0-2.9 2.8L12 19l-1.1-3.9A4 4 0 0 0 8 12.3L4 11.1 8 10a4 4 0 0 0 2.9-2.8L12 3Z" />
      <path d="m19 17 .4 1.6L21 19l-1.6.4L19 21l-.4-1.6L17 19l1.6-.4L19 17Z" />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 7-7 7 7M12 5v14" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function App() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')

  const [diagnosed, setDiagnosed] = useState(false)
  const [diagnosisData, setDiagnosisData] = useState(null)
  const [isDiagnosing, setIsDiagnosing] = useState(false)

  // Only one file is allowed
  const [pendingAttachment, setPendingAttachment] = useState(null)

  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState('')
  const [showScrollButton, setShowScrollButton] = useState(false)

  const fileInputRef = useRef(null)
  const scrollRef = useRef(null)
  const canDiagnose = messages.some(
    (message) =>
      message.role === 'user' &&
      message.text?.trim()
  )

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight
    }
  }, [messages, isTyping, diagnosisData])

  const handleScroll = () => {
    if (!scrollRef.current) {
      return
    }

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = scrollRef.current

    const distanceFromBottom =
      scrollHeight - scrollTop - clientHeight

    setShowScrollButton(distanceFromBottom > 120)
  }

  function getFileCategory(mimeType = '') {
    if (mimeType.startsWith('image/')) {
      return 'image'
    }

    if (mimeType.startsWith('audio/')) {
      return 'audio'
    }

    if (mimeType.startsWith('video/')) {
      return 'video'
    }

    if (mimeType === 'application/pdf') {
      return 'pdf'
    }

    if (mimeType.startsWith('text/')) {
      return 'text'
    }

    return 'file'
  }

  // ---------------------------------------------
  // ADD ONE FILE
  // ---------------------------------------------

  const addFiles = (fileList) => {
    setError('')

    const file = fileList[0]

    if (!file) {
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        `${file.name} is larger than 10 MB and was skipped.`
      )
      return
    }

    // Remove old file if a new one is selected
    if (pendingAttachment?.previewUrl) {
      URL.revokeObjectURL(
        pendingAttachment.previewUrl
      )
    }

    const isImage =
      file.type.startsWith('image/')

    const attachment = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      name: file.name,
      size: file.size,

      type: isImage
        ? 'image'
        : 'file',

      previewUrl: isImage
        ? URL.createObjectURL(file)
        : null,

      file: file,

      mime_type: file.type,

      file_type:
        getFileCategory(file.type),
    }

    setPendingAttachment(attachment)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // ---------------------------------------------
  // REMOVE FILE
  // ---------------------------------------------

  const removeAttachment = () => {
    if (pendingAttachment?.previewUrl) {
      URL.revokeObjectURL(
        pendingAttachment.previewUrl
      )
    }

    setPendingAttachment(null)
  }

  // ---------------------------------------------
  // UPLOAD FILE
  // ---------------------------------------------

  const sendFile = async (
    file,
    conversationId
  ) => {
    const formData = new FormData()

    formData.append(
      'file',
      file
    )

    formData.append(
      'conversation_id',
      conversationId || ''
    )

    formData.append(
      'file_type',
      getFileCategory(file.type)
    )

    formData.append(
      'file_mime_type',
      file.type
    )

    const response =
      await axiosClient.post(
        '/upload/',
        formData
      )

    console.log(
      'File upload response:',
      response.data
    )

    return response.data.file_id
  }

  // ---------------------------------------------
  // DIAGNOSE
  // ---------------------------------------------

  const handleDiagnose = async () => {
    const conversationId =
      localStorage.getItem('conversation_id')

    if (!conversationId || messages.length === 0 || isDiagnosing) {
      return
    }

    try {
      setIsDiagnosing(true)
      setError('')

      // Show the diagnosis request as a user message
      const userDiagnosisMessage = {
        id: `user-diagnose-${Date.now()}`,
        role: 'user',
        text: 'Please diagnose my car based on our conversation.',
        time: formatTime(),
        attachments: [],
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        userDiagnosisMessage,
      ])

      const response = await axiosClient.post(
        `/diagnose/${conversationId}/`
      )

      console.log(
        'Diagnosis API response:',
        response.data
      )

      /*
        Depending on your backend, diagnosis may be:
        
        1. A string
        2. A JSON object
      */

      let diagnosisText = response.data.diagnosis

      if (typeof diagnosisText === 'object') {
        diagnosisText = JSON.stringify(
          diagnosisText,
          null,
          2
        )
      }

      // Show diagnosis as assistant response
      const assistantDiagnosisMessage = {
        id: `assistant-diagnose-${Date.now()}`,
        role: 'assistant',
        text: diagnosisText || 'No diagnosis was returned.',
        time: formatTime(),
        attachments: [],
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantDiagnosisMessage,
      ])

      setDiagnosisData(response.data)
      setDiagnosed(true)

    } catch (error) {
      console.error(
        'Diagnosis error:',
        error
      )

      setError(
        error.response?.data?.error ||
        'Failed to get diagnosis.'
      )

      // If diagnosis failed, you may want to remove
      // the temporary user diagnosis message.
      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            !message.id.startsWith('user-diagnose-')
        )
      )

    } finally {
      setIsDiagnosing(false)
    }
  }

  // ---------------------------------------------
  // SEND MESSAGE
  // ---------------------------------------------

  const sendMessage = async (event) => {
    event?.preventDefault()

    const trimmedDraft =
      draft.trim()

    // Nothing to send
    if (
      !trimmedDraft &&
      !pendingAttachment
    ) {
      return
    }

    try {
      setIsTyping(true)
      setError('')

      const attachmentToSend =
        pendingAttachment

      let conversationId =
        localStorage.getItem(
          'conversation_id'
        )

      let fileId = null

      // -----------------------------------------
      // 1. Upload single file
      // -----------------------------------------

      if (attachmentToSend) {
        fileId = await sendFile(
          attachmentToSend.file,
          conversationId
        )
      }

      console.log(
        'Uploaded file ID:',
        fileId
      )

      // -----------------------------------------
      // 2. Prepare chat request
      // -----------------------------------------

      const chatData = {
        conversation_id:
          conversationId,
        input_text:
          trimmedDraft,
      }

      /*
       * Your current Django backend uses:
       *
       * file_id = request.data.get('file')
       *
       * Therefore send ONE file ID using
       * the "file" property.
       */
      if (fileId) {
        chatData.file = fileId
      }

      // -----------------------------------------
      // 3. Call chat API
      // -----------------------------------------

      const response =
        await axiosClient.post(
          '/chat/',
          chatData,
          {
            headers: {
              'Content-Type':
                'application/json',
              Accept:
                'application/json',
            },
          }
        )

      console.log(
        'Chat response:',
        response.data
      )

      // -----------------------------------------
      // 4. Store conversation ID
      // -----------------------------------------

      if (
        response.data.conversation_id
      ) {
        conversationId =
          response.data.conversation_id

        localStorage.setItem(
          'conversation_id',
          conversationId
        )
      }

      // -----------------------------------------
      // 5. Previous diagnosis is stale
      // -----------------------------------------

      setDiagnosed(false)
      setDiagnosisData(null)

      // -----------------------------------------
      // 6. Add messages to UI
      // -----------------------------------------

      setMessages(
        (currentMessages) => [
          ...currentMessages,

          {
            id:
              `user-${Date.now()}`,

            role:
              'user',

            text:
              trimmedDraft,

            time:
              formatTime(),

            attachments:
              attachmentToSend
                ? [
                  {
                    id:
                      attachmentToSend.id,

                    name:
                      attachmentToSend.name,

                    size:
                      attachmentToSend.size,

                    type:
                      attachmentToSend.type,

                    previewUrl:
                      attachmentToSend.previewUrl,
                  },
                ]
                : [],
          },

          {
            id:
              `assistant-${Date.now() + 1}`,

            role:
              'assistant',

            text:
              response.data.response,

            time:
              formatTime(),

            attachments: [],
          },
        ]
      )

      // -----------------------------------------
      // 7. Clear composer
      // -----------------------------------------

      setDraft('')
      setPendingAttachment(null)

    } catch (error) {
      console.error(
        'Send message error:',
        error
      )

      setError(
        error.response?.data?.error ||
        'Something went wrong. Please try again.'
      )
    } finally {
      setIsTyping(false)
    }
  }

  // ---------------------------------------------
  // KEYBOARD
  // ---------------------------------------------

  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()
      sendMessage(event)
    }
  }

  // ---------------------------------------------
  // FILE INPUT
  // ---------------------------------------------

  const handleFileChange = (event) => {
    if (event.target.files) {
      addFiles(event.target.files)
    }
  }

  const canSend =
    draft.trim() ||
    pendingAttachment !== null

  return (
    <main className="app-shell">

      <section
        className="chat-card"
        aria-label="Senior technician chat"
      >

        {/* ======================================
            HEADER
        ====================================== */}

        <header className="chat-header">

          <div className="technician-mark">
            <WrenchIcon />
          </div>

          <div className="header-text">

            <h1>
              Senior technician
            </h1>

            <p>
              {isTyping
                ? 'Typing…'
                : 'Working through the symptoms with you'}
            </p>

          </div>

          <span className="case-number">
            CASE PL-0248
          </span>

        </header>

        {/* ======================================
            CHAT BODY
        ====================================== */}

        <div className="chat-body">

          {/* ====================================
              MESSAGES
          ==================================== */}

          <div
            className="message-list"
            ref={scrollRef}
            onScroll={handleScroll}
          >

            <div className="date-divider">
              <span>
                Today&nbsp; · &nbsp;9:42 AM
              </span>
            </div>

            {messages.map(
              (message) => (
                <article
                  className={`message-row ${message.role}`}
                  key={message.id}
                >

                  {/* Assistant avatar */}

                  {message.role ===
                    'assistant' && (
                      <div className="message-avatar">
                        <WrenchIcon />
                      </div>
                    )}

                  <div className="message-content">

                    {/* ==========================
                        MESSAGE ATTACHMENTS
                    ========================== */}

                    {message.attachments?.length >
                      0 && (

                        <div className="message-attachments">

                          {message.attachments.map(
                            (attachment) =>

                              attachment.type ===
                                'image' &&
                                attachment.previewUrl ? (

                                <a
                                  key={
                                    attachment.id
                                  }
                                  href={
                                    attachment.previewUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="message-image"
                                >

                                  <img
                                    src={
                                      attachment.previewUrl
                                    }
                                    alt={
                                      attachment.name
                                    }
                                  />

                                </a>

                              ) : (

                                <div
                                  key={
                                    attachment.id
                                  }
                                  className="message-file"
                                >

                                  <div className="message-file-icon">
                                    <FileIcon />
                                  </div>

                                  <div className="message-file-info">

                                    <span className="message-file-name">
                                      {
                                        attachment.name
                                      }
                                    </span>

                                    <span className="message-file-size">
                                      {formatBytes(
                                        attachment.size
                                      )}
                                    </span>

                                  </div>

                                </div>

                              )
                          )}

                        </div>
                      )}

                    {/* ==========================
                        MESSAGE TEXT
                    ========================== */}

                    {message.text && (
                      <div className="message-bubble">
                        {message.text}
                      </div>
                    )}

                    {/* ==========================
                        MESSAGE META
                    ========================== */}

                    <div className="message-meta">

                      {message.role ===
                        'user' ? (
                        <>
                          <span>
                            You
                          </span>

                          <span>
                            ·
                          </span>

                          <span>
                            JD
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            Senior technician
                          </span>

                          <span>
                            ·
                          </span>
                        </>
                      )}

                      <span>
                        {message.time}
                      </span>

                    </div>

                  </div>

                  {/* User avatar */}

                  {message.role ===
                    'user' && (
                      <div className="user-avatar">
                        JD
                      </div>
                    )}

                </article>
              )
            )}

            {/* ==================================
                TYPING INDICATOR
            ================================== */}

            {isTyping && (
              <article className="message-row assistant">

                <div className="message-avatar">
                  <WrenchIcon />
                </div>

                <div className="message-content">

                  <div className="message-bubble typing-bubble">

                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />

                  </div>

                </div>

              </article>
            )}

          </div>

          {/* ====================================
              SCROLL BUTTON
          ==================================== */}

          {showScrollButton && (
            <button
              type="button"
              className="scroll-bottom-button"
              onClick={
                scrollToBottom
              }
              aria-label="Scroll to latest messages"
            >
              <ChevronDownIcon />
            </button>
          )}

          {/* ====================================
              DIAGNOSE BUTTON
          ==================================== */}

          <div className="diagnose-bar">
            <button
              type="button"
              className={`diagnose-button ${diagnosed ? 'is-diagnosed' : ''
                } ${!canDiagnose ? 'is-disabled' : ''}`}
              onClick={handleDiagnose}
              disabled={!canDiagnose || isDiagnosing}
            >
              <SparkleIcon />

              {isDiagnosing
                ? 'Diagnosing...'
                : diagnosed
                  ? 'Diagnosis ready'
                  : 'Diagnose'}
            </button>
          </div>

          {/* ====================================
              DIAGNOSIS RESULT
          ==================================== */}

        </div>

        {/* ======================================
            COMPOSER
        ====================================== */}

        <footer className="composer-area">

          {/* Error */}

          {error && (
            <p className="attachment-error">
              {error}
            </p>
          )}

          {/* ====================================
              PENDING SINGLE ATTACHMENT
          ==================================== */}

          {pendingAttachment && (

            <div className="attachment-previews">

              {pendingAttachment.type ===
                'image' &&
                pendingAttachment.previewUrl ? (

                <div className="attachment-chip image-chip">

                  <img
                    src={
                      pendingAttachment.previewUrl
                    }
                    alt={
                      pendingAttachment.name
                    }
                  />

                  <div className="chip-info">

                    <span className="chip-name">
                      {
                        pendingAttachment.name
                      }
                    </span>

                    <span className="chip-size">
                      {formatBytes(
                        pendingAttachment.size
                      )}
                    </span>

                  </div>

                  <button
                    type="button"
                    className="chip-remove"
                    onClick={
                      removeAttachment
                    }
                    aria-label={`Remove ${pendingAttachment.name}`}
                  >
                    <CloseIcon />
                  </button>

                </div>

              ) : (

                <div className="attachment-chip file-chip">

                  <div className="chip-file-icon">
                    <FileIcon />
                  </div>

                  <div className="chip-info">

                    <span className="chip-name">
                      {
                        pendingAttachment.name
                      }
                    </span>

                    <span className="chip-size">
                      {formatBytes(
                        pendingAttachment.size
                      )}
                    </span>

                  </div>

                  <button
                    type="button"
                    className="chip-remove"
                    onClick={
                      removeAttachment
                    }
                    aria-label={`Remove ${pendingAttachment.name}`}
                  >
                    <CloseIcon />
                  </button>

                </div>

              )}

            </div>
          )}

          {/* ====================================
              COMPOSER
          ==================================== */}

          <div className="composer">

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              onChange={
                handleFileChange
              }
              hidden
            />

            <button
              type="button"
              className="icon-button attachment-button"
              aria-label="Attach a photo or file"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              <PaperclipIcon />
            </button>

            <textarea
              value={draft}
              onChange={(event) =>
                setDraft(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="What's your car doing?"
              rows="1"
              aria-label="Message technician"
            />

            <button
              type="button"
              className={`send-button ${canSend
                ? 'can-send'
                : ''
                }`}
              onClick={
                sendMessage
              }
              aria-label="Send message"
              disabled={!canSend}
            >
              <ArrowUpIcon />
            </button>

          </div>

          <p className="composer-hint">
            Enter to send&nbsp; · &nbsp;Shift + Enter
            for a new line&nbsp; · &nbsp;Click the
            paperclip to attach a file
          </p>

        </footer>

      </section>

    </main>
  )
}

export default App
