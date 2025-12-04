import React, { useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, Package, Trash2, Edit, X, Save, Search, Home } from 'lucide-react';
import { 
    useProductsQuery, 
    useCreateProductMutation, 
    useUpdateProductMutation, 
    useDeleteProductMutation 
} from '../hooks/useProductsQuery';
import { imageService } from '../api/services/imageService';
import { handleSupabaseError } from '../lib/errorHandler';
import { formatCurrency } from '../lib/formatters';
import { useDebounce } from '../hooks/useDebounce';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const INITIAL_FORM_DATA = {
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
    imagem_url: '',
};

const ProductForm = ({ 
    formData, 
    onInputChange, 
    onImageUpload, 
    onSubmit, 
    onClose,
    uploading,
    isSubmitting,
    isEditing 
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <div className="bg-dark-surface border border-white/10 rounded-2xl p-4 md:p-6 max-w-2xl w-full shadow-2xl my-4 md:my-8">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    {isEditing ? <Edit className="text-primary" /> : <Plus className="text-primary" />}
                    {isEditing ? 'Editar Celular' : 'Novo Celular'}
                </h3>
                <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-white transition-colors"
                    type="button"
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">
                            Nome do Modelo
                        </label>
                        <input 
                            name="nome" 
                            value={formData.nome} 
                            onChange={onInputChange} 
                            className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" 
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">
                            Marca <span className="text-gray-600 text-xs">(Opc)</span>
                        </label>
                        <input 
                            name="marca" 
                            value={formData.marca} 
                            onChange={onInputChange} 
                            className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">
                            Valor (R$)
                        </label>
                        <input 
                            type="number" 
                            name="valor" 
                            value={formData.valor} 
                            onChange={onInputChange} 
                            className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" 
                            required 
                            min="0"
                            step="0.01"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">
                            Armazenamento <span className="text-gray-600 text-xs">(Opc)</span>
                        </label>
                        <input 
                            name="armazenamento" 
                            value={formData.armazenamento} 
                            onChange={onInputChange} 
                            placeholder="128GB" 
                            className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">
                            RAM <span className="text-gray-600 text-xs">(Opc)</span>
                        </label>
                        <input 
                            name="memoria_ram" 
                            value={formData.memoria_ram} 
                            onChange={onInputChange} 
                            placeholder="4GB" 
                            className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">
                            Cor <span className="text-gray-600 text-xs">(Opc)</span>
                        </label>
                        <input 
                            name="cor" 
                            value={formData.cor} 
                            onChange={onInputChange} 
                            className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">
                            Câmera <span className="text-gray-600 text-xs">(Opc)</span>
                        </label>
                        <input 
                            name="camera" 
                            value={formData.camera} 
                            onChange={onInputChange} 
                            placeholder="48MP" 
                            className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">
                            Bateria <span className="text-gray-600 text-xs">(Opc)</span>
                        </label>
                        <input 
                            name="bateria" 
                            value={formData.bateria} 
                            onChange={onInputChange} 
                            placeholder="5000mAh" 
                            className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none" 
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">
                            Imagem do Produto
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-dark border border-white/10 rounded-lg overflow-hidden flex-shrink-0">
                                {formData.imagem_url ? (
                                    <img 
                                        src={formData.imagem_url} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                        <Package size={20} />
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={onImageUpload}
                                    className="block w-full text-xs md:text-sm text-gray-400
                                        file:mr-2 md:file:mr-4 file:py-1.5 md:file:py-2 file:px-3 md:file:px-4
                                        file:rounded-full file:border-0
                                        file:text-xs md:file:text-sm file:font-semibold
                                        file:bg-primary file:text-dark
                                        hover:file:bg-primary-dark
                                        cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP. Max 2MB.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">
                            Condição
                        </label>
                        <select 
                            name="condicao" 
                            value={formData.condicao} 
                            onChange={onInputChange} 
                            className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none"
                        >
                            <option value="Novo">Novo</option>
                            <option value="Seminovo">Seminovo</option>
                            <option value="Usado">Usado</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-0.5">
                            Situação
                        </label>
                        <select 
                            name="situacao" 
                            value={formData.situacao} 
                            onChange={onInputChange} 
                            className="w-full bg-dark border border-white/10 rounded-lg p-2 md:p-2.5 text-sm md:text-base text-white focus:border-primary focus:outline-none"
                        >
                            <option value="Normal">Normal</option>
                            <option value="Oferta">Oferta</option>
                            <option value="Lançamento">Lançamento</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 md:mt-6 pt-4 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={uploading || isSubmitting}
                        className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-dark font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {uploading || isSubmitting ? 'Enviando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    </div>
);

const ProductCard = ({ phone, onEdit, onDelete }) => (
    <div className="bg-dark-surface border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
        <div className="h-56 md:h-64 lg:h-72 bg-gray-800 relative overflow-hidden">
            {phone.imagem_url ? (
                <img 
                    src={phone.imagem_url} 
                    alt={phone.nome} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Package size={40} />
                </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={() => onEdit(phone)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                    type="button"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={() => onDelete(phone.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                    type="button"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            {phone.situacao !== 'Normal' && (
                <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white z-10 ${
                    phone.situacao === 'Oferta' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                    {phone.situacao}
                </span>
            )}
        </div>
        <div className="p-3 md:p-4">
            <h3 className="font-bold text-base md:text-lg mb-1 truncate">{phone.nome}</h3>
            <p className="text-primary font-bold text-lg md:text-xl mb-2 md:mb-3">
                {formatCurrency(phone.valor)}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                {phone.armazenamento && (
                    <div className="bg-white/5 p-1.5 rounded text-center">{phone.armazenamento}</div>
                )}
                {phone.memoria_ram && (
                    <div className="bg-white/5 p-1.5 rounded text-center">{phone.memoria_ram}</div>
                )}
                <div className="bg-white/5 p-1.5 rounded text-center col-span-2">{phone.condicao}</div>
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPhone, setEditingPhone] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    
    const { data, isLoading, isError, error } = useProductsQuery({ limit: 100 });
    const createMutation = useCreateProductMutation();
    const updateMutation = useUpdateProductMutation();
    const deleteMutation = useDeleteProductMutation();
    
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const phones = data?.products || [];

    const filteredPhones = useMemo(() => {
        if (!debouncedSearchTerm) return phones;
        
        const searchLower = debouncedSearchTerm.toLowerCase();
        return phones.filter(phone =>
            phone.nome?.toLowerCase().includes(searchLower) ||
            phone.marca?.toLowerCase().includes(searchLower)
        );
    }, [phones, debouncedSearchTerm]);

    const handleLogout = useCallback(async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    }, [navigate]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleImageUpload = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const imageUrl = await imageService.upload(file);
            setFormData(prev => ({ ...prev, imagem_url: imageUrl }));
        } catch (err) {
            const errorInfo = handleSupabaseError(err, 'AdminDashboard.handleImageUpload');
            alert(`Erro ao fazer upload: ${errorInfo.message}`);
        } finally {
            setUploading(false);
        }
    }, []);

    const openModal = useCallback((phone = null) => {
        if (phone) {
            setEditingPhone(phone);
            setFormData({
                nome: phone.nome || '',
                marca: phone.marca || '',
                armazenamento: phone.armazenamento || '',
                memoria_ram: phone.memoria_ram || '',
                camera: phone.camera || '',
                bateria: phone.bateria || '',
                cor: phone.cor || '',
                condicao: phone.condicao || 'Novo',
                situacao: phone.situacao || 'Normal',
                valor: phone.valor || '',
                imagem_url: phone.imagem_url || '',
            });
        } else {
            setEditingPhone(null);
            setFormData(INITIAL_FORM_DATA);
        }
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingPhone(null);
        setFormData(INITIAL_FORM_DATA);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        try {
            const { id, created_at, ...dataToSave } = formData;

            if (editingPhone) {
                await updateMutation.mutateAsync({ id: editingPhone.id, data: dataToSave });
            } else {
                await createMutation.mutateAsync(dataToSave);
            }

            closeModal();
        } catch (err) {
            const errorInfo = handleSupabaseError(err, 'AdminDashboard.handleSubmit');
            alert(`Erro ao salvar: ${errorInfo.message}`);
        }
    }, [formData, editingPhone, createMutation, updateMutation, closeModal]);

    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este item?')) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) {
            const errorInfo = handleSupabaseError(err, 'AdminDashboard.handleDelete');
            alert(`Erro ao excluir: ${errorInfo.message}`);
        }
    }, [deleteMutation]);

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="min-h-screen bg-dark text-white font-body">
            <header className="bg-dark-surface border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-primary">CF CELL Admin</h1>
                    <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-400 border border-white/10">
                        Dashboard
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-medium"
                    >
                        <Home size={18} />
                        <span className="hidden sm:inline">Ir para o Site</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium"
                        type="button"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Sair</span>
                    </button>
                </div>
            </header>

            <main className="p-6 container mx-auto max-w-7xl">
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
                        type="button"
                    >
                        <Plus size={20} />
                        Novo Celular
                    </button>
                </div>

                {isError && (
                    <ErrorMessage 
                        error={error} 
                        title="Erro ao carregar dados"
                        onRetry={() => window.location.reload()}
                        className="mb-6"
                    />
                )}

                {isLoading ? (
                    <LoadingSpinner size="lg" className="h-64" />
                ) : filteredPhones.length === 0 ? (
                    <EmptyState 
                        message={searchTerm ? 'Nenhum celular encontrado para esta busca.' : 'Nenhum celular encontrado.'}
                        description={searchTerm ? 'Tente buscar por outro termo.' : 'Adicione um novo item para começar.'}
                        action={
                            !searchTerm && (
                                <button
                                    onClick={() => openModal()}
                                    className="btn-primary"
                                    type="button"
                                >
                                    <Plus size={20} />
                                    Adicionar Primeiro Item
                                </button>
                            )
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {filteredPhones.map((phone) => (
                            <ProductCard 
                                key={phone.id} 
                                phone={phone} 
                                onEdit={openModal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            {isModalOpen && (
                <ProductForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    onImageUpload={handleImageUpload}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                    uploading={uploading}
                    isSubmitting={isSubmitting}
                    isEditing={Boolean(editingPhone)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
