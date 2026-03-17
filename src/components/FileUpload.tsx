import { useRef, useState } from 'react';

interface FileUploadProps {
  /** 'image' accepts jpg/png/webp/gif · 'pdf' accepts pdf only */
  accept: 'image' | 'pdf';
  /** Current value (URL string or local path like /certificates/cert.pdf) */
  value: string;
  /** Called with the final path/URL once upload succeeds */
  onChange: (value: string) => void;
  /** Admin password — forwarded to /api/uploadFile */
  adminPassword: string;
  /** GitHub folder to save into: 'certificates' | 'projects' */
  folder: 'certificates' | 'projects';
  label?: string;
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error';

export function FileUpload({ accept, value, onChange, adminPassword, folder, label }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMsg, setErrorMsg]       = useState('');
  const [mode, setMode]               = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput]       = useState(value.startsWith('http') ? value : '');

  const acceptAttr = accept === 'image'
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : 'application/pdf';

  const isLocalPath = value && !value.startsWith('http');
  const isUrl       = value && value.startsWith('http');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadState('uploading');
    setErrorMsg('');

    try {
      // Read file as base64
      const base64Content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => {
          const result = reader.result as string;
          // Remove the "data:...;base64," prefix — GitHub API wants just the base64 part
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/uploadFile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: adminPassword,
          fileName: file.name,
          folder,
          base64Content,
        }),
      });

      const data = await res.json() as { success?: boolean; path?: string; error?: string };

      if (!res.ok || !data.path) throw new Error(data.error || 'Erro no upload');

      onChange(data.path);
      setUploadState('done');
    } catch (err) {
      setErrorMsg(String(err));
      setUploadState('error');
    }

    // Reset input so same file can be re-selected if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUrlSave = () => {
    onChange(urlInput.trim());
    setMode('file');
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-white/40 text-xs block">{label}</label>}

      {/* Toggle: upload file vs paste URL */}
      <div className="flex rounded-lg overflow-hidden border border-white/10 w-fit">
        {(['file', 'url'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 text-xs transition ${mode === m ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}
          >
            {m === 'file' ? '📁 Arquivo' : '🔗 Link'}
          </button>
        ))}
      </div>

      {/* File upload mode */}
      {mode === 'file' && (
        <div
          className={`relative border-2 border-dashed rounded-xl transition cursor-pointer ${
            uploadState === 'uploading' ? 'border-amber-500/40 bg-amber-500/5' :
            uploadState === 'done'      ? 'border-green-500/40 bg-green-500/5' :
            uploadState === 'error'     ? 'border-red-500/40 bg-red-500/5' :
            'border-white/10 hover:border-indigo-500/50 bg-white/[0.02] hover:bg-white/[0.04]'
          }`}
          onClick={() => uploadState !== 'uploading' && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptAttr}
            onChange={handleFile}
            className="hidden"
          />

          <div className="px-4 py-3 text-center">
            {uploadState === 'uploading' && (
              <div className="flex items-center justify-center gap-2 text-amber-300 text-sm">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Enviando para o GitHub...
              </div>
            )}
            {uploadState === 'done' && (
              <p className="text-green-400 text-sm">✓ Arquivo salvo em <code className="text-xs bg-green-500/10 px-1 rounded">{value}</code></p>
            )}
            {uploadState === 'error' && (
              <p className="text-red-400 text-sm">✗ {errorMsg}</p>
            )}
            {uploadState === 'idle' && (
              <>
                <p className="text-white/40 text-sm">
                  {accept === 'pdf' ? '📄 Clique para enviar PDF' : '🖼️ Clique para enviar imagem'}
                </p>
                <p className="text-white/20 text-xs mt-1">
                  {accept === 'pdf' ? 'PDF · max ~10 MB' : 'JPG, PNG, WebP · max ~5 MB'}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* URL paste mode */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="admin-input flex-1"
          />
          <button
            type="button"
            onClick={handleUrlSave}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition"
          >
            Usar
          </button>
        </div>
      )}

      {/* Current value preview */}
      {value && uploadState !== 'uploading' && (
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
          {accept === 'image' && (
            <img src={value} alt="preview" className="w-10 h-8 object-cover rounded" />
          )}
          {accept === 'pdf' && <span className="text-red-400 text-base">📄</span>}
          <span className="text-white/40 text-xs truncate flex-1">
            {isLocalPath ? `Arquivo local: ${value}` : isUrl ? value : value}
          </span>
          <button
            type="button"
            onClick={() => { onChange(''); setUploadState('idle'); setUrlInput(''); }}
            className="text-white/20 hover:text-red-400 transition text-sm flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
