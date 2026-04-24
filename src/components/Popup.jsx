export default function Popup({ message, onClose }) {

    if (!message) return null

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={onClose}
        >

            <div
                className="popup-enter bg-[#020617] border border-red-400 rounded-xl p-6 w-[320px] text-center shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >

                <p className="text-red-400 font-semibold mb-3">
                    Error
                </p>

                <p className="text-slate-300 text-sm mb-5">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="btn-primary"
                >
                    OK
                </button>

            </div>

        </div>
    )
}