import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useLocation } from 'react-router-dom'
import { bugReportValidation } from '@/lib/validation'
import { useCreateBugReport } from '@/lib/react-query/queriesAndMutatuins'
import { useUserContext } from '@/context/UseUserContext'
import { ClipLoader } from 'react-spinners'

type BugReportModalProps = {
  isOpen: boolean
  onClose: () => void
}

const BugReportModal = ({ isOpen, onClose }: BugReportModalProps) => {
  const { user } = useUserContext()
  const location = useLocation()
  const { mutateAsync: createBugReport, isPending } = useCreateBugReport()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof bugReportValidation>>({
    resolver: zodResolver(bugReportValidation),
    defaultValues: { description: "" },
  })

  if (!isOpen) return null

  const onSubmit = async (values: z.infer<typeof bugReportValidation>) => {
    await createBugReport({
      reporterId: user.id,
      description: values.description,
      pagePath: location.pathname,
      userAgent: navigator.userAgent,
    })
    setIsSubmitted(true)
  }

  const handleClose = () => {
    reset()
    setIsSubmitted(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-dark-2 rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        {isSubmitted ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-white text-center">Thanks — your report has been submitted.</p>
            <button onClick={handleClose} className="text-primary-500 text-sm font-semibold">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <h2 className="text-white text-lg font-semibold">Report a bug</h2>
            <textarea
              {...register("description")}
              placeholder="What went wrong?"
              rows={5}
              className="bg-dark-3 rounded-lg px-3 py-2 text-sm text-white outline-none resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description.message}</p>
            )}
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={handleClose} className="text-light-3 text-sm">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="bg-primary-500 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <ClipLoader size={14} color="#fff" />}
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default BugReportModal