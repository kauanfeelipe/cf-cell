import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Package, Trash2, Edit, X, Save, Search, Home } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [phones, setPhones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPhone, setEditingPhone] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        nome: '',
        marca: '',
        armazenamento: '',
        memoria_ram: '',
        camera: '',
        bateria: '',
        cor: '',
        condicao: 'Novo',
        situacao: 'Normal',
        valor: '',
        imagem_url: ''
    });

    useEffect(() => {
        fetchPhones();
    }, []);

    const fetchPhones = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('celulares_venda')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching phones:', error);
        else setPhones(data || []);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('phones')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('phones')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, imagem_url: data.publicUrl }));
        } catch (error) {
            alert('Erro ao fazer upload da imagem: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const openModal = (phone = null) => {
        if (phone) {
            setEditingPhone(phone);
            setFormData({
                ...phone,
                // Ensure all fields exist even if null in DB
                marca: phone.marca || '',
                armazenamento: phone.armazenamento || '',
                memoria_ram: phone.memoria_ram || '',
                camera: phone.camera || '',
                bateria: phone.bateria || '',
                cor: phone.cor || '',
                condicao: phone.condicao || 'Novo',
                situacao: phone.situacao || 'Normal',
                imagem_url: phone.imagem_url || ''
            });
        } else {
            setEditingPhone(null);
            setFormData({
                nome: '',
                marca: '',
                armazenamento: '',
                memoria_ram: '',
                camera: '',
                bateria: '',
                cor: '',
                condicao: 'Novo',
                situacao: 'Normal',
                valor: '',
                imagem_url: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { id, created_at, ...dataToSave } = formData; // Exclude id/created_at for insert/update

        if (editingPhone) {
            const { error } = await supabase
                .from('celulares_venda')
                .update(dataToSave)
                .eq('id', editingPhone.id);
            if (error) alert('Erro ao atualizar: ' + error.message);
        } else {
            const { error } = await supabase
                .from('celulares_venda')
                .insert([dataToSave]);
            if (error) alert('Erro ao criar: ' + error.message);
        }

        setIsModalOpen(false);
        fetchPhones();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
            const { error } = await supabase
                .from('celulares_venda')
                .delete()
                .eq('id', id);
            if (error) alert('Erro ao excluir: ' + error.message);
            else fetchPhones();
        }
    };

    const filteredPhones = phones.filter(phone =>
        phone.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.marca?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-dark text-white font-body">
            {/* Header */}
            <header className="bg-dark-surface border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-primary">CF CELL Admin</h1>
                    <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-400 border border-white/10">Dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-medium"
                    >
                        <Home size={18} />
                        <span className="hidden sm:inline">Ir para o Site</span>
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Sair</span>
                    </button>
                </div>
            </header>

            <main className="p-6 container mx-auto max-w-7xl">
                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar celular..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-dark-surface border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="w-full md:w-auto bg-primary hover:bg-primary-dark text-dark font-bold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    >
                        <Plus size={20} />
                        Novo Celular
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : filteredPhones.length === 0 ? (
                    <div className="bg-dark-surface border border-white/10 rounded-xl p-12 text-center">
                        <Package className="mx-auto text-gray-600 mb-4" size={48} />
                        <p className="text-gray-400 text-lg">Nenhum celular encontrado.</p>
                        <p className="text-gray-600 text-sm mt-2">Adicione um novo item para começar.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {filteredPhones.map((phone) => (
                            <div key={phone.id} className="bg-dark-surface border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
                                <div className="h-56 md:h-64 lg:h-72 bg-gray-800 relative overflow-hidden">
                                    {phone.imagem_url ? (
                                        <img src={phone.imagem_url} alt={phone.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <Package size={40} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                                        <button
                                            onClick={() => openModal(phone)}
                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(phone.id)}
                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    {phone.situacao !== 'Normal' && (
                                        <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white z-10 ${phone.situacao === 'Oferta' ? 'bg-red-500' : 'bg-blue-500'}`}>
                                            {phone.situacao}
                                        </span>
                                    )}
                                </div>
                                <div className="p-3 md:p-4">
                                    <h3 className="font-bold text-base md:text-lg mb-1 truncate">{phone.nome}</h3>
                                    <p className="text-primary font-bold text-lg md:text-xl mb-2 md:mb-3">R$ {Number(phone.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>

                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                                        {phone.armazenamento && <div className="bg-white/5 p-1.5 rounded text-center">{phone.armazenamento}</div>}
                                        {phone.memoria_ram && <div className="bg-white/5 p-1.5 rounded text-center">{phone.memoria_ram}</div>}
                                        <div className="bg-white/5 p-1.5 rounded text-center col-span-2">{phone.condicao}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-dark-surface border border-white/10 rounded-2xl p-4 md:p-6 max-w-2xl w-full shadow-2xl my-4 md:my-8">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                {editingPhone ? <Edit className="text-primary" /> : <Plus className="text-primary" />}
                                {editingPhone ? 'Editar Celular' : 'Novo Celular'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                            <div className="grid grid-cols-2 gap-2 md:gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">Nome do Modelo</label>
                                    <input name="nome" value={formData.nome} onChange={handleInputChange} className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">Marca <span className="text-gray-600 text-xs">(Opc)</span></label>
                                    <input name="marca" value={formData.marca} onChange={handleInputChange} className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">Valor (R$)</label>
                                    <input type="number" name="valor" value={formData.valor} onChange={handleInputChange} className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">Armazenamento <span className="text-gray-600 text-xs">(Opc)</span></label>
                                    <input name="armazenamento" value={formData.armazenamento} onChange={handleInputChange} placeholder="128GB" className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">RAM <span className="text-gray-600 text-xs">(Opc)</span></label>
                                    <input name="memoria_ram" value={formData.memoria_ram} onChange={handleInputChange} placeholder="4GB" className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">Cor <span className="text-gray-600 text-xs">(Opc)</span></label>
                                    <input name="cor" value={formData.cor} onChange={handleInputChange} className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">Câmera <span className="text-gray-600 text-xs">(Opc)</span></label>
                                    <input name="camera" value={formData.camera} onChange={handleInputChange} placeholder="48MP" className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">Bateria <span className="text-gray-600 text-xs">(Opc)</span></label>
                                    <input name="bateria" value={formData.bateria} onChange={handleInputChange} placeholder="5000mAh" className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">Imagem do Produto</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-dark border border-white/10 rounded-lg overflow-hidden flex-shrink-0">
                                            {formData.imagem_url ? (
                                                <img src={formData.imagem_url} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                    <Package size={20} />
                                                </div>
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="block w-full text-xs md:text-sm text-gray-400
                                                    file:mr-2 md:file:mr-4 file:py-1.5 md:file:py-2 file:px-3 md:file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-xs md:file:text-sm file:font-semibold
                                                    file:bg-primary file:text-dark
                                                    hover:file:bg-primary-dark
                                                    cursor-pointer"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">JPG, PNG. Max 2MB.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">Condição</label>
                                    <select name="condicao" value={formData.condicao} onChange={handleInputChange} className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none">
                                        <option value="Novo">Novo</option>
                                        <option value="Seminovo">Seminovo</option>
                                        <option value="Usado">Usado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">Situação</label>
                                    <select name="situacao" value={formData.situacao} onChange={handleInputChange} className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none">
                                        <option value="Normal">Normal</option>
                                        <option value="Oferta">Oferta</option>
                                        <option value="Lançamento">Lançamento</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4 md:mt-6 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-dark font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save size={18} />
                                    {uploading ? 'Enviando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
