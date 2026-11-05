import React, { useState } from 'react';
import { TabMateriais } from '../components/disciplina/TabMateriais';
import { TabExercicios } from '../components/disciplina/TabExercicios';
import { TabAulas } from '../components/disciplina/TabAulas';
import { TabDuvidas } from '../components/disciplina/TabDuvidas';
import { TabReferencias } from '../components/disciplina/TabReferencias';

export function GerenciarDisciplinaPage() {
    const [activeTab, setActiveTab] = useState('aulas');

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Gerenciar Disciplina</h1>

            <div className="flex border-b border-gray-200 overflow-x-auto">
                {['Aulas', 'Materiais', 'Exercícios', 'Dúvidas', 'Referências'].map(tab => {
                    const tabKey = tab.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tabKey)}
                            className={`py-3 px-6 text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === tabKey
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6">
                {activeTab === 'aulas' && <TabAulas />}
                {activeTab === 'materiais' && <TabMateriais />}
                {activeTab === 'exercicios' && <TabExercicios />}
                {activeTab === 'duvidas' && <TabDuvidas />}
                {activeTab === 'referencias' && <TabReferencias />}
            </div>
        </div>
    );
}