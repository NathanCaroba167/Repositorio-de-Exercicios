import React, { useRef, useState } from 'react';

export function TabMateriais() {
    const fileInputRef = useRef(null);
    const [materiais, setMateriais] = useState([
        { id: 1, nome: "Apostila_Teorica.pdf" }
    ]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMateriais([...materiais, { id: Date.now(), nome: file.name }]);
        }
    };

    return (
        <div className="space-y-6">
            <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center cursor-pointer hover:border-orange-500 bg-white transition"
            >
                <p className="text-sm font-bold text-gray-700">Clique para procurar ou arraste arquivos aqui</p>
                <p className="text-xs text-gray-400 mt-1">Suporta PDF, imagens, links e documentos</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Materiais Adicionados</h3>
                {materiais.map(mat => (
                    <div key={mat.id} className="p-4 bg-white border rounded-xl shadow-sm flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{mat.nome}</span>
                        <span className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md font-bold">Arquivo</span>
                    </div>
                ))}
            </div>
        </div>
    );
}