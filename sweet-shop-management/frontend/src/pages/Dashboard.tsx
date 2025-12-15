import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { sweetsAPI, Sweet } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState(1);

  const searchParams: any = {};
  if (searchName) searchParams.name = searchName;
  if (searchCategory) searchParams.category = searchCategory;
  if (minPrice) searchParams.minPrice = parseFloat(minPrice);
  if (maxPrice) searchParams.maxPrice = parseFloat(maxPrice);

  const { data: sweets = [], isLoading, error, isError } = useQuery({
    queryKey: ['sweets', searchParams],
    queryFn: () => {
      if (Object.keys(searchParams).length > 0) {
        return sweetsAPI.search(searchParams);
      }
      return sweetsAPI.getAll();
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: sweetsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      setIsAddModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Sweet> }) =>
      sweetsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      setIsEditModalOpen(false);
      setSelectedSweet(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sweetsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      sweetsAPI.purchase(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      setIsPurchaseModalOpen(false);
      setPurchaseQuantity(1);
    },
  });

  const restockMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      sweetsAPI.restock(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      setIsRestockModalOpen(false);
      setRestockQuantity(1);
    },
  });

  const handlePurchase = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setIsPurchaseModalOpen(true);
  };

  const handleRestock = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setIsRestockModalOpen(true);
  };

  const handleEdit = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      deleteMutation.mutate(id);
    }
  };

  const categories = sweets.length > 0 ? Array.from(new Set(sweets.map((s) => s.category))) : [];

  // Safety check - if user is not loaded, show loading
  if (!user) {
    return <div>Loading...</div>;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1>Sweet Shop Management System</h1>
          <div className="header-actions">
            <span>Welcome, {user?.username} ({user?.role})</span>
            <button onClick={logout} className="button button-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="search-section">
          <h2>Search & Filter</h2>
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
            />
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="search-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="search-input"
              step="0.01"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="search-input"
              step="0.01"
            />
            <button
              onClick={() => {
                setSearchName('');
                setSearchCategory('');
                setMinPrice('');
                setMaxPrice('');
              }}
              className="button button-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {isAdmin && (
          <div className="admin-actions">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="button button-primary"
            >
              Add New Sweet
            </button>
          </div>
        )}

        <div className="sweets-grid">
          {isLoading ? (
            <div>Loading sweets...</div>
          ) : isError ? (
            <div className="error-message" style={{ padding: '20px', textAlign: 'center' }}>
              <h3>Error loading sweets</h3>
              <p>{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
              <small>Make sure the backend server is running on http://localhost:3001</small>
              <br />
              <button 
                onClick={() => window.location.reload()} 
                className="button button-primary"
                style={{ marginTop: '10px' }}
              >
                Retry
              </button>
            </div>
          ) : sweets.length === 0 ? (
            <div className="no-sweets">
              <h3>No sweets found</h3>
              <p>There are no sweets available at the moment.</p>
              {isAdmin ? (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="button button-primary"
                  style={{ marginTop: '20px' }}
                >
                  Add Your First Sweet
                </button>
              ) : (
                <p style={{ color: '#666', marginTop: '10px' }}>
                  Please check back later or contact an administrator.
                </p>
              )}
            </div>
          ) : (
            sweets.map((sweet) => (
              <div key={sweet.id} className="sweet-card">
                <h3>{sweet.name}</h3>
                <p className="sweet-category">{sweet.category}</p>
                <p className="sweet-price">${sweet.price.toFixed(2)}</p>
                <p className="sweet-quantity">
                  In Stock: <strong>{sweet.quantity}</strong>
                </p>
                <div className="sweet-actions">
                  {!isAdmin && (
                    <button
                      onClick={() => handlePurchase(sweet)}
                      className="button button-primary"
                      disabled={sweet.quantity === 0}
                    >
                      Purchase
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEdit(sweet)}
                        className="button button-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRestock(sweet)}
                        className="button button-secondary"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleDelete(sweet.id)}
                        className="button button-danger"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add Sweet Modal */}
      {isAddModalOpen && (
        <AddSweetModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      )}

      {/* Edit Sweet Modal */}
      {isEditModalOpen && selectedSweet && (
        <EditSweetModal
          sweet={selectedSweet}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSweet(null);
          }}
          onSubmit={(data) =>
            updateMutation.mutate({ id: selectedSweet.id, data })
          }
          isLoading={updateMutation.isPending}
        />
      )}

      {/* Purchase Modal */}
      {isPurchaseModalOpen && selectedSweet && (
        <PurchaseModal
          sweet={selectedSweet}
          quantity={purchaseQuantity}
          onQuantityChange={setPurchaseQuantity}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setPurchaseQuantity(1);
            setSelectedSweet(null);
          }}
          onSubmit={() =>
            purchaseMutation.mutate({
              id: selectedSweet.id,
              quantity: purchaseQuantity,
            })
          }
          isLoading={purchaseMutation.isPending}
        />
      )}

      {/* Restock Modal */}
      {isRestockModalOpen && selectedSweet && (
        <RestockModal
          sweet={selectedSweet}
          quantity={restockQuantity}
          onQuantityChange={setRestockQuantity}
          onClose={() => {
            setIsRestockModalOpen(false);
            setRestockQuantity(1);
            setSelectedSweet(null);
          }}
          onSubmit={() =>
            restockMutation.mutate({
              id: selectedSweet.id,
              quantity: restockQuantity,
            })
          }
          isLoading={restockMutation.isPending}
        />
      )}
    </div>
  );
};

// Add Sweet Modal Component
const AddSweetModal = ({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (data: { name: string; category: string; price: number; quantity?: number }) => void;
  isLoading: boolean;
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity) || 0,
    });
  };

  return (
    <Modal onClose={onClose} title="Add New Sweet">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="button button-secondary">
            Cancel
          </button>
          <button type="submit" className="button button-primary" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Sweet'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Edit Sweet Modal Component
const EditSweetModal = ({
  sweet,
  onClose,
  onSubmit,
  isLoading,
}: {
  sweet: Sweet;
  onClose: () => void;
  onSubmit: (data: Partial<Sweet>) => void;
  isLoading: boolean;
}) => {
  const [name, setName] = useState(sweet.name);
  const [category, setCategory] = useState(sweet.category);
  const [price, setPrice] = useState(sweet.price.toString());
  const [quantity, setQuantity] = useState(sweet.quantity.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity) || 0,
    });
  };

  return (
    <Modal onClose={onClose} title="Edit Sweet">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="button button-secondary">
            Cancel
          </button>
          <button type="submit" className="button button-primary" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Sweet'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Purchase Modal Component
const PurchaseModal = ({
  sweet,
  quantity,
  onQuantityChange,
  onClose,
  onSubmit,
  isLoading,
}: {
  sweet: Sweet;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const totalPrice = sweet.price * quantity;

  return (
    <Modal onClose={onClose} title={`Purchase ${sweet.name}`}>
      <form onSubmit={handleSubmit}>
        <p>Available: {sweet.quantity}</p>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            max={sweet.quantity}
            value={quantity}
            onChange={(e) => onQuantityChange(parseInt(e.target.value))}
            required
          />
        </div>
        <p className="total-price">Total: ${totalPrice.toFixed(2)}</p>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="button button-secondary">
            Cancel
          </button>
          <button type="submit" className="button button-primary" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Purchase'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Restock Modal Component
const RestockModal = ({
  sweet,
  quantity,
  onQuantityChange,
  onClose,
  onSubmit,
  isLoading,
}: {
  sweet: Sweet;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal onClose={onClose} title={`Restock ${sweet.name}`}>
      <form onSubmit={handleSubmit}>
        <p>Current Stock: {sweet.quantity}</p>
        <div className="form-group">
          <label>Quantity to Add</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => onQuantityChange(parseInt(e.target.value))}
            required
          />
        </div>
        <p className="total-price">New Stock: {sweet.quantity + quantity}</p>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="button button-secondary">
            Cancel
          </button>
          <button type="submit" className="button button-primary" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Restock'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Modal Component
const Modal = ({
  onClose,
  title,
  children,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Dashboard;

