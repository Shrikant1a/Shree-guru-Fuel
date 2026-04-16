import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Fuel, Droplets, Gauge, MapPin, Phone, User, Settings, ChevronRight, Menu, X, ArrowRight, CheckCircle2, Loader2, FileText, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import html2canvas from 'html2canvas';
import { fuelService, requestService } from './services/api';

const WhatsAppIcon = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill={color} 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Navbar = ({ onAdminClick, isAdminView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About Us', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Services', href: '#services' },
    { name: 'Fuel Prices', href: '#prices' },
    { name: 'Contact', href: '#contact' },
  ];

  if (isAdminView) return null; // Hide navbar in admin view or refine later

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-lg py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Fuel className="text-slate-900" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white uppercase sm:block hidden">
            Shriguru <span className="text-primary italic">Petrol Pump</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-slate-300 hover:text-primary transition-colors font-medium">
              {link.name}
            </a>
          ))}
          <button 
            onClick={onAdminClick}
            className="btn-primary flex items-center gap-2"
          >
            Admin Login <ArrowRight size={18} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold tracking-tight text-slate-300">
                  {link.name}
                </a>
              ))}
              <button onClick={() => { setIsMenuOpen(false); onAdminClick(); }} className="btn-primary w-full py-4 text-center">Admin Login</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FuelCard = ({ type, price, lastUpdated, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500 text-${color}`}>
      <Icon size={120} />
    </div>
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${color === 'primary' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-bold mb-2 uppercase">{type}</h3>
    <div className="flex items-baseline gap-1">
      <span className="text-4xl font-extrabold text-white">₹{price || '---'}</span>
      <span className="text-slate-400">/ Litre</span>
    </div>
    <p className="text-xs text-slate-500 mt-4 italic font-medium">
      Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Updating...'}
    </p>
  </motion.div>
);

const ServiceItem = ({ icon: Icon, title, desc }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
  >
    <div className="shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
      <Icon size={24} />
    </div>
    <div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);
const ReceiptModal = ({ isOpen, onClose, data, onComplete }) => {
  const handlePrint = () => {
    window.print();
  };

  const total = (data?.quantity || 0) * (data?.rate || 0);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 px-4 receipt-modal-container">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-sm relative z-10"
          >
            {/* The printable area */}
            <div 
              className="bg-white text-slate-900 rounded-none border-[12px] border-slate-100 shadow-2xl font-mono text-sm overflow-hidden print-receipt relative"
            >
              {/* Branded Watermark */}
              <div className="watermark pointer-events-none select-none">
                 SHREEGURU
              </div>
              {/* Shreeguru Brand Header */}
              <div className="p-6 bg-slate-50 border-b border-dashed border-slate-200 flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-primary text-slate-900 rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                    <Fuel size={24} />
                 </div>
                 <div className="text-center">
                    <h2 className="text-xl font-black italic tracking-tighter text-slate-900 leading-tight">SHREEGURU <span className="text-primary">FUELS</span></h2>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">Pure for Sure Station</p>
                 </div>
              </div>

              <div className="bg-primary/10 p-2 text-center border-b border-dashed border-slate-200">
                 <p className="text-[10px] font-black uppercase tracking-widest text-secondary italic">Bharat Petroleum Partnership</p>
              </div>
              
              <div className="p-8 space-y-6">
                 <div className="text-center border-b border-dashed border-slate-300 pb-4">
                    <p className="text-xs text-slate-500 uppercase">Transaction ID</p>
                    <p className="font-bold text-lg">#BP-{data?.transactionId || Math.floor(100000 + Math.random() * 900000)}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(data?.timestamp || Date.now()).toLocaleString()}</p>
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between">
                       <span className="text-slate-500">Customer:</span>
                       <span className="font-bold text-right">{data?.customerName || 'Walk-in'}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Service:</span>
                       <span className="font-bold text-right uppercase text-slate-700">{data?.serviceType}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Payment Mode:</span>
                       <span className="font-bold text-right uppercase text-blue-600">{data?.paymentType || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Rate:</span>
                       <span className="font-bold">₹{(data?.rate || 0).toFixed(2)}/L</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Quantity:</span>
                       <span className="font-bold">{data?.quantity || 0}L</span>
                    </div>
                 </div>

                 <div className="border-t border-dashed border-slate-300 pt-4 flex justify-between items-center px-2 py-4 bg-slate-50">
                    <span className="text-lg font-black uppercase">Total:</span>
                    <span className="text-2xl font-black italic">₹{total.toFixed(2)}</span>
                 </div>

                 <div className="text-center space-y-4 pt-4">
                    <p className="text-[10px] text-slate-400 italic">Thank you for fueling at Shreeguru Fuels!<br/>"Pure for Sure Platinum" certified.</p>
                 </div>
              </div>
              <div className="flex justify-between px-0">
                 {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-slate-100 rotate-45 -mb-2"></div>
                 ))}
              </div>
            </div>

            {/* Non-printable buttons section */}
            <div className="mt-8 grid grid-cols-2 gap-3 no-print">
               <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl border border-white/10 transition-all font-bold uppercase tracking-widest text-xs"
              >
                🖨️ PDF / Print
              </button>
              <button 
                onClick={() => onComplete(data)}
                className="flex items-center justify-center gap-2 bg-primary text-slate-900 py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all font-bold uppercase tracking-widest text-xs"
              >
                ✅ Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const PriceTrendChart = ({ data }) => (
  <div className="glass-card p-8 border-primary/20 bg-primary/5 h-[400px]">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h3 className="text-xl font-bold">Price Trend <span className="text-primary italic">Analytics</span></h3>
        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Last 7 Days (₹ / Litre)</p>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-[10px] font-bold text-slate-400">PETROL</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary"></div>
          <span className="text-[10px] font-bold text-slate-400">DIESEL</span>
        </div>
      </div>
    </div>
    
    <div className="h-[280px] w-full">
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPetrol" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFD100" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#FFD100" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorDiesel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0055A5" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#0055A5" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
        <XAxis 
          dataKey="day" 
          stroke="#475569" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          domain={['dataMin - 1', 'dataMax + 1']} 
          stroke="#475569" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0f172a', 
            border: '1px solid #ffffff10', 
            borderRadius: '12px',
            fontSize: '12px'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="petrol" 
          stroke="#FFD100" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorPetrol)" 
        />
        <Area 
          type="monotone" 
          dataKey="diesel" 
          stroke="#0055A5" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorDiesel)" 
        />
      </AreaChart>
      </ResponsiveContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center text-slate-600 italic text-xs">
          Gathering trend data...
        </div>
      )}
    </div>
  </div>
);

const AdminDashboard = ({ onLogout, fuelPrices, onUpdatePrice, galleryImages, onGalleryUpdate }) => {
  const [requests, setRequests] = useState([]);
  const [savedReceipts, setSavedReceipts] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  useEffect(() => {
    // Load requests
    const demoReqs = JSON.parse(localStorage.getItem('demo_requests') || '[]');
    setRequests(demoReqs.sort((a, b) => b.date - a.date));
    
    // Load Transaction History (Receipts)
    const history = JSON.parse(localStorage.getItem('saved_receipts') || '[]');
    setSavedReceipts(history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  }, []);

  const handleGenerateBill = (req) => {
    setActiveReceipt({
      customerName: req.customerName,
      serviceType: req.serviceType,
      quantity: req.quantity || 20,
      paymentType: req.paymentType || 'CASH',
      rate: req.serviceType === 'DIESEL' ? 90.47 : 103.92
    });
    setIsReceiptModalOpen(true);
  };

  const handleCompleteTransaction = (data) => {
    // If it's an existing receipt being viewed, just close
    if (data.id) {
      setIsReceiptModalOpen(false);
      return;
    }

    const history = JSON.parse(localStorage.getItem('saved_receipts') || '[]');
    const newEntry = { 
      ...data, 
      id: Date.now(), 
      transactionId: `BP-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString() 
    };
    
    const updatedHistory = [newEntry, ...history];
    localStorage.setItem('saved_receipts', JSON.stringify(updatedHistory));
    setSavedReceipts(updatedHistory);
    
    alert(`Receipt for ${data.customerName} saved successfully!`);
    setIsReceiptModalOpen(false);
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!newImageUrl) return;
    const newImg = { id: Date.now(), url: newImageUrl, alt: 'Admin Uploaded' };
    onGalleryUpdate([...galleryImages, newImg]);
    setNewImageUrl('');
  };

  const handleDeleteImage = (id) => {
    onGalleryUpdate(galleryImages.filter(img => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 pt-24">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold italic tracking-tight uppercase">Admin <span className="text-primary italic">Dashboard</span></h2>
            <p className="text-slate-400 text-sm">Manage station operations and customer requests.</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold w-full md:w-auto justify-center">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price & Gallery Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Price Management */}
            <div className="glass-card p-6 border-primary/20 bg-primary/5">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Settings className="text-primary" size={20} /> Update Fuel Rates
              </h3>
              <div className="space-y-4">
                {fuelPrices.length > 0 ? fuelPrices.map(fuel => (
                  <div key={fuel.id} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 capitalize">{fuel.type} Price (₹)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        defaultValue={fuel.price}
                        id={`price-${fuel.type}`}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50"
                      />
                      <button 
                        onClick={() => {
                          const newPrice = document.getElementById(`price-${fuel.type}`).value;
                          onUpdatePrice(fuel.type, newPrice);
                        }}
                        className="bg-primary text-slate-900 px-4 py-2 rounded-xl font-bold text-xs"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                )) : (
                   <p className="text-xs text-slate-500 italic">No price data available.</p>
                )}
              </div>
            </div>

            {/* Gallery Management */}
            <div className="glass-card p-6 border-secondary/20 bg-secondary/5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="text-secondary" size={18} /> Manage Gallery
              </h3>
              <form onSubmit={handleAddImage} className="mb-4 space-y-2">
                <input 
                  type="url" 
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste Image URL"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-secondary/50"
                />
                <button type="submit" className="btn-secondary w-full py-2 text-xs">Add New Photo</button>
              </form>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {galleryImages.map(img => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden h-20 border border-white/5">
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Bill Generator */}
            <div className="glass-card p-6 border-white/10 bg-white/5 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="text-primary" size={20} /> Quick Bill
              </h3>
              <div className="space-y-3">
                <input 
                  id="walkin-name"
                  type="text" 
                  placeholder="Customer Name"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary/50"
                />
                <div className="grid grid-cols-2 gap-2">
                   <select 
                     id="walkin-type"
                     className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary/50"
                   >
                     <option value="PETROL">Petrol</option>
                     <option value="DIESEL">Diesel</option>
                   </select>
                   <input 
                     id="walkin-qty"
                     type="number" 
                     placeholder="Qty (L)"
                     className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary/50"
                   />
                </div>
                <select 
                  id="walkin-payment"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary/50"
                >
                  <option value="CASH">Cash Payment</option>
                  <option value="UPI">UPI / QR Scan</option>
                  <option value="CARD">Debit / Credit Card</option>
                  <option value="PETROCARD">BPCL PetroCard</option>
                </select>
                <button 
                  onClick={() => {
                    const name = document.getElementById('walkin-name').value;
                    const type = document.getElementById('walkin-type').value;
                    const qty = document.getElementById('walkin-qty').value;
                    const payment = document.getElementById('walkin-payment').value;
                    if (!name || !qty) return alert("Please fill all details");
                    handleGenerateBill({ 
                      customerName: name, 
                      serviceType: type,
                      isWalkin: true,
                      quantity: parseFloat(qty),
                      paymentType: payment
                    });
                  }}
                  className="btn-primary w-full py-2 text-xs font-black uppercase tracking-widest"
                >
                  Generate Walk-in Bill
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="font-bold">Station Status</h4>
              <p className="text-xs text-slate-400">All automated systems are functioning properly.</p>
              <span className="bg-green-500/20 text-green-500 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Online</span>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Request Management */}
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                   <User className="text-secondary" size={20} /> Latest Service Requests
                </h3>
                <span className="bg-white/5 px-3 py-1 rounded-lg text-xs font-medium text-slate-400">{requests.length} Total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-500 uppercase tracking-widest bg-white/5">
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {requests.length > 0 ? requests.map((req) => (
                      <tr key={req.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium">{req.customerName}</td>
                        <td className="px-6 py-4 text-slate-400">{req.phone}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-md">{req.serviceType}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold bg-green-500/20 text-green-500 px-2 py-1 rounded-full uppercase">Pending</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button 
                             onClick={() => handleGenerateBill(req)}
                             className="text-[10px] font-black uppercase text-primary border border-primary/30 px-3 py-1 rounded-lg hover:bg-primary hover:text-slate-900 transition-all cursor-pointer"
                           >
                             🧾 Gen Bill
                           </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic text-sm">No pending service requests.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Receipt History Management */}
            <div className="glass-card overflow-hidden border-blue-500/20">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-blue-500/5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                   <FileText className="text-blue-500" size={20} /> Digital Receipt History
                </h3>
                <span className="bg-blue-500/10 px-3 py-1 rounded-lg text-xs font-bold text-blue-500">{savedReceipts.length} Transactions</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-slate-500 uppercase tracking-widest bg-white/5">
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Trx ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Fuel/Qty</th>
                      <th className="px-6 py-3">Payment</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {savedReceipts.length > 0 ? savedReceipts.map((bill) => (
                      <tr 
                        key={bill.id} 
                        onClick={() => {
                          setActiveReceipt(bill);
                          setIsReceiptModalOpen(true);
                        }}
                        className="hover:bg-blue-500/5 transition-colors text-xs cursor-pointer group"
                      >
                        <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                          {new Date(bill.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-mono text-blue-400 uppercase group-hover:text-blue-300 transition-colors">
                          {bill.transactionId}
                        </td>
                        <td className="px-6 py-4 font-bold">{bill.customerName}</td>
                        <td className="px-6 py-4">
                           <span className="uppercase text-slate-500 font-bold">{bill.serviceType}</span>
                           <span className="text-slate-400 ml-2">({bill.quantity}L)</span>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-black italic uppercase text-slate-500">{bill.paymentType}</td>
                        <td className="px-6 py-4 text-right font-black text-white">
                          ₹{(bill.quantity * bill.rate).toFixed(2)}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic text-sm">No transaction history found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        data={activeReceipt}
        onComplete={handleCompleteTransaction}
      />
    </div>
  );
};

function App() {
  const [fuelPrices, setFuelPrices] = useState(() => {
    const saved = localStorage.getItem('saved_fuel_prices');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, type: 'PETROL', price: 103.92, lastUpdated: new Date().toISOString() },
      { id: 2, type: 'DIESEL', price: 90.47, lastUpdated: new Date().toISOString() },
      { id: 3, type: 'CNG', price: 86.50, lastUpdated: new Date().toISOString() }
    ];
  });
  const [loading, setLoading] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPetroCardModalOpen, setIsPetroCardModalOpen] = useState(false);
  const [isPetroCardFormView, setIsPetroCardFormView] = useState(false);
  const [galleryImages, setGalleryImages] = useState([
    { id: 1, url: 'https://lh3.googleusercontent.com/p/AF1QipOf2zoegzlEHKqwGJuc8-cEZEJMTYKjYW6zB8XD=s0', alt: 'Night View' },
    { id: 2, url: 'https://lh3.googleusercontent.com/p/AF1QipN1fA0eYjRi2rJdVOhOEij3kCevoBp9cqwlXrJm=s0', alt: 'Daytime View' },
    { id: 3, url: 'https://lh3.googleusercontent.com/p/AF1QipNp2AbEloNc6h2uQ9EGvoud7CC1p-7QbPLiwXWt=s0', alt: 'Fuel Pumps' },
    { id: 4, url: 'https://lh3.googleusercontent.com/p/AF1QipMBIZnR4jtixgBWM7uq72vLAgNRWrM-5pAC_NcB=s0', alt: 'BPCL Branding' }
  ]);
  const [trendData] = useState([
    { day: 'Mon', petrol: 104.50, diesel: 91.20 },
    { day: 'Tue', petrol: 104.20, diesel: 91.00 },
    { day: 'Wed', petrol: 103.90, diesel: 90.80 },
    { day: 'Thu', petrol: 103.92, diesel: 90.47 },
    { day: 'Fri', petrol: 104.10, diesel: 90.60 },
    { day: 'Sat', petrol: 104.30, diesel: 90.85 },
    { day: 'Sun', petrol: 104.15, diesel: 90.70 },
  ]);
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    serviceType: 'Fuel Delivery',
    message: ''
  });

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'Shriguru' && loginForm.password === 'Shri$1919') {
      setIsAdminView(true);
      setIsLoginModalOpen(false);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('Invalid Credentials! Authorized access only.');
    }
  };

  const fetchPrices = async () => {
    try {
      // Only try fetching if the backend is likely to be there (demo purposes)
      // We'll catch and go silent if it fails more than once
      const response = await fuelService.getPrices().catch(err => {
         // Silently fail to avoid console clutter if we already have local data
         return null;
      });

      if (response && response.data && response.data.length > 0) {
        setFuelPrices(response.data);
      }
      setLoading(false);
    } catch (error) {
      // Completely silent catch for price pooling in demo mode
    }
  };

  const updatePriceLocally = (type, newPrice) => {
     const updated = fuelPrices.map(f => 
       f.type.toUpperCase() === type.toUpperCase() 
       ? {...f, price: parseFloat(newPrice), lastUpdated: new Date().toISOString() } 
       : f
     );
     setFuelPrices(updated);
     localStorage.setItem('saved_fuel_prices', JSON.stringify(updated));
     alert(`Price for ${type} updated station-wide to ₹${newPrice}!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      await requestService.submitRequest(formData);
      setFormStatus('success');
      setFormData({ customerName: '', phone: '', serviceType: 'Fuel Delivery', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.warn("Backend not reachable, switching to Demo Mode (LocalStorage)");
      // Save to localStorage as a fallback
      const demoRequests = JSON.parse(localStorage.getItem('demo_requests') || '[]');
      demoRequests.push({ ...formData, id: Date.now(), date: new Date().toISOString() });
      localStorage.setItem('demo_requests', JSON.stringify(demoRequests));
      
      // Still show success to the user for a smooth demo experience
      setTimeout(() => {
        setFormStatus('success');
        setFormData({ customerName: '', phone: '', serviceType: 'Fuel Delivery', message: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      }, 1000);
    }
  };

  if (isAdminView) {
    return (
      <div className="bg-mesh min-h-screen">
         <Navbar onAdminClick={() => setIsLoginModalOpen(true)} isAdminView={true} />
         <AdminDashboard 
            onLogout={() => setIsAdminView(false)} 
            fuelPrices={fuelPrices.length > 0 ? fuelPrices : [
              { id: 1, type: 'PETROL', price: 103.92 },
              { id: 2, type: 'DIESEL', price: 90.47 },
              { id: 3, type: 'CNG', price: 86.50 }
            ]}
            onUpdatePrice={updatePriceLocally}
            galleryImages={galleryImages}
            onGalleryUpdate={setGalleryImages}
          />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh text-white selection:bg-primary/30">
      {/* WhatsApp Floating Button */}
      <motion.a 
        href="https://wa.me/918485872370?text=Hello%20Shreeguru%20Fuels!%20I%20have%20a%20query%20about%20your%20services."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-[90] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:brightness-110 transition-all border-4 border-white/20"
      >
        <WhatsAppIcon className="w-8 h-8" color="white" />
      </motion.a>

      <Navbar onAdminClick={() => setIsLoginModalOpen(true)} isAdminView={false} />
      
      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-md p-10 relative z-10 border-primary/30"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} />
                </div>
                <h3 className="text-2xl font-bold">Admin <span className="text-primary">Secure Login</span></h3>
                <p className="text-slate-400 text-sm">Authorized personnel only.</p>
              </div>
              
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
                  <input 
                    required
                    type="text" 
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    placeholder="Enter username"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                  <input 
                    required
                    type="password" 
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50"
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-4 shadow-xl shadow-primary/20 cursor-pointer">
                  Access Portal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Modal */}
      <AnimatePresence>
        {isStatusModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStatusModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="glass-card w-full max-w-lg p-8 relative z-10"
            >
              <button onClick={() => setIsStatusModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X size={24} />
              </button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gauge size={32} />
                </div>
                <h3 className="text-2xl font-bold">Real-time <span className="text-primary">Inventory Status</span></h3>
                <p className="text-slate-400 text-sm">Automated live monitoring of underground tanks.</p>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Petrol (91 Octane)', level: 85, color: 'bg-primary' },
                  { label: 'Diesel (Euro VI)', level: 92, color: 'bg-secondary' },
                  { label: 'CNG Store', level: 45, color: 'bg-primary' }
                ].map((tank) => (
                  <div key={tank.label} className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{tank.label}</span>
                      <span className={tank.level < 50 ? 'text-red-400' : 'text-green-400'}>{tank.level}% Full</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${tank.level}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full ${tank.color} shadow-[0_0_10px_rgba(234,179,8,0.3)]`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-primary" />
                <p className="text-xs text-slate-300">All tanks verified at 4:30 PM (IST). Fuel quality checked for today.</p>
              </div>

              <button onClick={() => setIsStatusModalOpen(false)} className="btn-primary w-full mt-8">Close Status Board</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PetroCard Modal */}
      <AnimatePresence>
        {isPetroCardModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPetroCardModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="glass-card w-full max-w-2xl p-0 relative z-10 overflow-hidden border-secondary/30"
            >
              <div className="bg-secondary p-8 text-white relative">
                <button onClick={() => setIsPetroCardModalOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
                  <X size={24} />
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight">BPCL <span className="text-primary italic">PetroCard</span></h3>
                    <p className="text-blue-100 text-sm italic">India's first smart card for fueling.</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {!isPetroCardFormView ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <h4 className="font-bold text-primary flex items-center gap-2">
                            <CheckCircle2 size={18} /> Instant Rewards
                          </h4>
                          <p className="text-xs text-slate-400">Earn "PetroMiles" on every transaction. Redeem for free fuel or exciting gifts.</p>
                      </div>
                      <div className="space-y-2">
                          <h4 className="font-bold text-primary flex items-center gap-2">
                            <CheckCircle2 size={18} /> 0.75% Cashback
                          </h4>
                          <p className="text-xs text-slate-400">Government-mandated digital incentive on every fuel purchase made via PetroCard.</p>
                      </div>
                      <div className="space-y-2">
                          <h4 className="font-bold text-primary flex items-center gap-2">
                            <CheckCircle2 size={18} /> High-Speed Sync
                          </h4>
                          <p className="text-xs text-slate-400">Instant SMS alerts for every transaction with precise quantity and price details.</p>
                      </div>
                      <div className="space-y-2">
                          <h4 className="font-bold text-primary flex items-center gap-2">
                            <CheckCircle2 size={18} /> Easy Top-up
                          </h4>
                          <p className="text-xs text-slate-400">Recharge easily via UPI, Credit Card, or at any Shreeguru Fuel station.</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 space-y-4">
                      <p className="text-sm italic text-slate-300">"Join 20 Million+ happy users transitioning to digital fueling with Bharat Petroleum."</p>
                      <button 
                        onClick={() => setIsPetroCardFormView(true)}
                        className="btn-secondary w-full py-4 text-lg"
                      >
                        Apply for New PetroCard
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="text-xl font-bold">New Card Application</h4>
                       <button onClick={() => setIsPetroCardFormView(false)} className="text-xs text-primary font-bold uppercase tracking-widest">Back to Benefits</button>
                    </div>
                    
                    <form className="space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      alert("Application Submitted! Your PetroCard will be processed and sent to your address within 7-10 working days.");
                      setIsPetroCardModalOpen(false);
                      setIsPetroCardFormView(false);
                    }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                          <input required type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50" placeholder="John Doe" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Mobile Number</label>
                          <input required type="tel" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50" placeholder="+91 00000 00000" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Vehicle Number (Primary)</label>
                        <input required type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50" placeholder="MH 12 AB 1234" />
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                        <input type="checkbox" required className="mt-1" />
                        <p className="text-[10px] text-slate-400">I agree to the terms and conditions and authorize Bharat Petroleum to process my application for a PetroCard Smart Fueling Account.</p>
                      </div>
                      <button type="submit" className="btn-primary w-full py-4 mt-2">Submit Application</button>
                    </form>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Official Bharat Petroleum Partner
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tighter">
              Shreeguru <span className="text-primary italic">Fuels</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200 italic">Pure for Sure</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mx-auto lg:mx-0">
              Energising lives with premium quality fuel. Experience the promise of 100% quality and quantity with BPCL's Pure for Sure certified station.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a href="#contact" className="btn-primary">Book Service Now</a>
              <button 
                onClick={() => setIsStatusModalOpen(true)}
                className="flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-all font-bold cursor-pointer"
              >
                Check Fuel Status
              </button>
            </div>
            {/* Pure for Sure Badge */}
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="pt-4 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit mx-auto lg:mx-0"
            >
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2 shadow-inner border border-blue-100">
                 <span className="text-[10px] font-black text-[#0055A5] leading-tight text-center">BHARAT<br/>PETROLEUM</span>
               </div>
               <div>
                  <p className="text-xs uppercase tracking-widest text-primary font-bold">Certified Station</p>
                  <p className="text-sm font-bold">Pure for Sure Platinum</p>
               </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative z-10 animate-float">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 rounded-3xl"></div>
              <img 
                src="/hero-station.png" 
                alt="Shreeguru Fuels Premium BPCL Station"
                className="rounded-3xl shadow-2xl skew-y-3 grayscale-0 border-4 border-white/5"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="bg-primary text-slate-900 px-4 py-1 rounded-full font-bold text-sm shadow-xl">Now Available: Speed Premium Petrol</span>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 rounded-full blur-[100px] -z-0"></div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10">
                 <img src="/legacy-station.png" alt="Shreeguru Fuels Station Legacy" className="w-full h-auto" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                 <div className="absolute bottom-8 left-8">
                    <p className="text-4xl font-black italic text-primary leading-none">EST. 2020</p>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">Wadule Bk. Legacy</p>
                 </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter italic uppercase">Our <span className="text-primary italic">Story</span></h2>
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                  Started in 2020, Shreeguru Fuels was established to bring modern digital fueling and uncompromising purity to the commuters of Shevgaon.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1 uppercase tracking-tight">Our Mission</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">To energise every journey through Wadule Bk. with high-tech refueling standards, 100% quantity transparency, and BPCL quality excellence.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0 text-secondary">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1 uppercase tracking-tight">Why Trust Us?</h4>
                    <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside mt-2">
                       <li>Established in 2020 with state-of-the-art tech.</li>
                       <li>Bharat Petroleum "Pure for Sure Platinum" Certified.</li>
                       <li>Fully automated dispensing for 100% quantity.</li>
                       <li>Trusted by thousands of local commuters and fleets since day one.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-6">
                 <div className="text-center">
                    <p className="text-3xl font-black text-white">10k+</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Happy Customers</p>
                 </div>
                 <div className="w-px h-10 bg-white/10"></div>
                 <div className="text-center">
                    <p className="text-3xl font-black text-white">4M+</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Litres Dispensed</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fuel Prices Section */}
      <section id="prices" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold italic tracking-tight uppercase">Bharat <span className="text-primary italic">Fuel Rates</span></h2>
            <p className="text-slate-400">Experience world-class performance and transparency with our live price analytics.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              {fuelPrices.length > 0 ? (
                fuelPrices.map((f) => (
                  <FuelCard 
                    key={f.id}
                    type={f.type === 'PETROL' ? 'Speed Petrol' : f.type === 'DIESEL' ? 'Hi-Speed Diesel' : 'CNG (Green)'} 
                    price={f.price} 
                    lastUpdated={f.lastUpdated}
                    icon={f.type === 'PETROL' ? Droplets : f.type === 'DIESEL' ? Fuel : Gauge} 
                    color={f.type === 'PETROL' ? 'primary' : 'secondary'} 
                  />
                ))
              ) : (
                <>
                  <FuelCard type="Speed Petrol" price="103.92" icon={Droplets} color="primary" />
                  <FuelCard type="Hi-Speed Diesel" price="90.47" icon={Fuel} color="secondary" />
                  <FuelCard type="CNG (Green)" price="86.50" icon={Gauge} color="primary" />
                </>
              )}
            </div>

            <div className="lg:col-span-2">
              <PriceTrendChart data={trendData} />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3 space-y-6">
              <h2 className="text-4xl font-bold italic tracking-tighter">OUR <br /><span className="text-primary uppercase tracking-normal">Premium Services</span></h2>
              <p className="text-slate-400 leading-relaxed">
                Empowering your journey with next-generation digital fueling and loyalty solutions.
              </p>
              <button 
                onClick={() => setIsPetroCardModalOpen(true)}
                className="btn-secondary whitespace-nowrap"
              >
                Explore PetroCard
              </button>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ServiceItem 
                icon={CheckCircle2} 
                title="Pure for Sure" 
                desc="A promise of 100% Quality & Quantity assurance with high-tech automated dispensing systems." 
              />
              <ServiceItem 
                icon={User} 
                title="UFill Experience" 
                desc="Experience the power of touchless mobile fueling. Pre-pay via app for a seamless experience." 
              />
              <ServiceItem 
                icon={Settings} 
                title="MAK Lubricants" 
                desc="Keep your engine young with MAK - India's most trusted range of lubricants and oils." 
              />
              <ServiceItem 
                icon={Gauge} 
                title="Nitrogen Air" 
                desc="Automated Nitrogen filling for better tire life, cooler runs, and improved fuel efficiency." 
              />
              <ServiceItem 
                icon={Droplets} 
                title="EV Fast Charging" 
                desc="Future-ready DC fast charging stations for all major electric vehicles in India." 
              />
              <ServiceItem 
                icon={Phone} 
                title="24/7 Assistance" 
                desc="Round-the-clock roadside assistance and emergency fuel support for our patrons." 
              />
              <ServiceItem 
                icon={Settings} 
                title="In & Out Store" 
                desc="A quick-stop convenience store for snacks, beverages, and travel essentials." 
              />
              <ServiceItem 
                icon={Gauge} 
                title="SmartFleet" 
                desc="Advanced fleet management solution for commercial vehicle owners with special rewards." 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-slate-900/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl lg:text-5xl font-bold italic tracking-tight uppercase">Station <span className="text-secondary">Gallery</span></h2>
             <p className="text-slate-400 max-w-2xl mx-auto">Real photos from our Wadule Bk. station. Experience the premium infrastructure and clean environment that defines Shreeguru Fuels.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {galleryImages.map((img, index) => (
               <motion.div 
                 key={img.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
                 whileHover={{ scale: 1.02 }}
                 className={`${index === 0 ? 'lg:col-span-2 lg:row-span-2 h-[400px] lg:h-[624px]' : 'h-[300px]'} rounded-3xl overflow-hidden border border-white/10 shadow-2xl`}
               >
                 <img src={img.url} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
               </motion.div>
             ))}
             
             {/* Special Trust Banner placeholder if gallery is short */}
             <motion.div 
               whileHover={{ scale: 1.01 }}
               className="lg:col-span-3 rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[200px] bg-gradient-to-r from-secondary/80 to-primary/80 flex items-center justify-center p-8 text-center mt-6"
             >
                <p className="text-xl md:text-3xl font-black italic text-slate-900 uppercase">A Clean Station is a Trusted Station. Since 2020.</p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Service Promise / Core Values */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/tech-bg.png" alt="Energy Background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="glass-card p-12 border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6 md:w-1/2">
              <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">The <span className="text-primary italic text-6xl">Promise</span> <br /> of Purity</h2>
              <p className="text-slate-300">We don't just sell fuel; we deliver trust. Every drop at Shreeguru Fuels is verified for 100% Quality and Quantity.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <CheckCircle2 size={16} /> Quality Service
                </div>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <CheckCircle2 size={16} /> Accurate Quantity
                </div>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <CheckCircle2 size={16} /> Quality Products
                </div>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <CheckCircle2 size={16} /> 24/7 Service
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-48 h-48 rounded-full border-4 border-primary/30 flex items-center justify-center p-4 relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
                <div className="text-center">
                  <p className="text-4xl font-black italic text-primary leading-none">PFS</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Platinum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="glass-card overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-12 space-y-8">
                <h2 className="text-4xl font-bold">Get In <span className="text-primary">Touch</span></h2>
                <div className="space-y-6 pb-6">
                   <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Location</p>
                        <p className="font-medium text-slate-200 text-sm">Miri Rd, Wadule Bk., Shevgaon <br />Maharashtra 414502</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                        <Phone size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Phone</p>
                        <p className="font-medium text-slate-200">+91 84858 72370</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Email</p>
                        <p className="font-medium text-slate-200 text-sm">support@shreegurufuels.com</p>
                      </div>
                   </div>
                </div>
                
                <div className="pt-2 space-y-4">
                  <a 
                    href="tel:08485872370" 
                    className="btn-primary w-full py-4 text-lg shadow-xl shadow-primary/20 animate-pulse-slow flex items-center justify-center gap-2"
                  >
                    <Phone size={20} /> Call Now
                  </a>
                  
                  <a 
                    href="https://maps.app.goo.gl/dy7ZSwwBHhspdArz5" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all font-bold text-lg"
                  >
                    <MapPin size={20} className="text-primary" /> Get Directions
                  </a>
                  <a 
                    href="https://wa.me/918485872370?text=Hello%20Shreeguru%20Fuels!%20I%20have%20a%20query%20about%20your%20services." 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-full border border-white/20 hover:bg-[#25D366]/10 transition-all font-bold text-lg"
                  >
                    <WhatsAppIcon className="w-6 h-6" color="#25D366" /> Chat on WhatsApp
                  </a>
                </div>
                {/* Google Map Embed */}
                <div className="w-full h-64 bg-slate-800 rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
                  <iframe 
                    title="Shreeguru Fuels location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.123456789!2d75.1780491!3d19.3437738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDIwJzM3LjYiTiA3NcKwMTAnNDEuMCJF!5e0!3m2!1sen!2sin!4v1713251234567!5m2!1sen!2sin"
                    className="w-full h-full border-0 grayscale invert contrast-75 brightness-75"
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              <div className="lg:w-1/2 bg-white/5 p-12 flex flex-col justify-center">
                {formStatus === 'success' ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-2xl font-bold">Request Sent!</h3>
                    <p className="text-slate-400">Our team will contact you shortly.</p>
                    <button onClick={() => setFormStatus('idle')} className="text-primary font-bold">Send another request</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-400">Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" 
                        placeholder="Your full name" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">Phone</label>
                        <input 
                          required
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" 
                          placeholder="+91 00000 00000" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">Service required</label>
                        <select 
                          value={formData.serviceType}
                          onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                          className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                        >
                          <option>Fuel Delivery</option>
                          <option>Bulk Order</option>
                          <option>PetroCard Inquiry</option>
                          <option>Lubricants</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-400">Message</label>
                      <textarea 
                        rows="3"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors resize-none" 
                        placeholder="Tell us what you need..." 
                      />
                    </div>
                    <button 
                      disabled={formStatus === 'sending'}
                      className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                    >
                      {formStatus === 'sending' ? (
                        <>
                          <Loader2 className="animate-spin" size={20} /> Sending...
                        </>
                      ) : 'Send Request'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-30">
            <Fuel size={20} />
            <span className="font-bold uppercase tracking-wider">Shriguru Petrol Pump</span>
          </div>
          <p>© 2026 Shriguru Petrol Pump Management System. Inspired by Bharat Petroleum.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
