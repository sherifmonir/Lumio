import type { FileUploaderProps } from '@/types'
import { useCallback, useState } from 'react'
import { useDropzone, type FileWithPath } from 'react-dropzone'

const MAX_DIMENSION = 1600
const WEBP_QUALITY = 0.8

function compressImage(file: File): Promise<File> {
  // SVGs are vector — resizing/re-encoding to a raster format would throw
  // away the one advantage they have, so let them through untouched.
  if (file.type === 'image/svg+xml') return Promise.resolve(file)

  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)

      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(file)

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file)
          const compressedName = file.name.replace(/\.\w+$/, '.webp')
          resolve(new File([blob], compressedName, { type: blob.type }))
        },
        'image/webp',
        WEBP_QUALITY
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file) 
    }

    img.src = objectUrl
  })
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [ file,  setFile] = useState<File[]>([])
    const [fileUrl, setFileUrl] = useState(mediaUrl)
    const [prevMediaUrl, setPrevMediaUrl] = useState(mediaUrl)
    const [isCompressing, setIsCompressing] = useState(false)

    if (mediaUrl !== prevMediaUrl) {
        setPrevMediaUrl(mediaUrl)
        setFileUrl(mediaUrl)
    }

    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        setIsCompressing(true)
        const compressedFile = await compressImage(acceptedFiles[0])
        setIsCompressing(false)

        setFile([compressedFile])
        fieldChange([compressedFile])
        setFileUrl(URL.createObjectURL(compressedFile))
    }, [fieldChange])

  const {getRootProps, getInputProps} = useDropzone({onDrop,
    accept: {
        'image/*':['.png', '.jpg', '.jpeg', '.svg']
    }
  })
  return (
    <div {...getRootProps()} className="flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer"/>
      {
        isCompressing ? (
            <div className="flex flex-1 justify-center items-center w-full p-5 lg:p-10">
                <p className="text-light-3 small-regular">Optimizing image...</p>
            </div>
        ) : fileUrl ? (
            <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
                <img
                src={fileUrl}
                alt="image"
                className="file-uploader-img"
                />
            </div>
            
        ):(
            <div className="file_uploader-box">
                <img
                src="/assets/icons/file-upload.svg"
                width={96}
                height={77}
                alt="file-upload"
                />
                <h3 className="base-medium text-light-2 mb-2 mt-6">
                    Drag photo here.
                </h3>
                <p className="text-light-4 small-regular mb-6">
                    SVG, PNG, JPG
                </p>
                <button type="button" className="Add-photo-button">
                    Select from computer
                </button>
            </div>
        )
        
          
      }
    </div>
  )
}

export default FileUploader