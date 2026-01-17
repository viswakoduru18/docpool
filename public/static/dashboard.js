// DocPool Web Dashboard
// Comprehensive view and management of doctor data

const API_BASE = '/api';

const dashboard = {
  doctors: [],
  stats: {},
  filters: {},
  selectedDoctor: null,
  
  init() {
    this.loadStats();
    this.loadDoctors();
    this.render();
  },
  
  async loadStats() {
    try {
      const response = await axios.get(`${API_BASE}/stats`);
      if (response.data.success) {
        this.stats = response.data.data;
        this.renderStats();
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  },
  
  async loadDoctors(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE}/doctors?${params}`);
      if (response.data.success) {
        this.doctors = response.data.data;
        this.renderDoctorTable();
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      this.showToast('Error loading doctors', 'error');
    }
  },
  
  async viewDoctor(id) {
    try {
      const response = await axios.get(`${API_BASE}/doctors/${id}`);
      if (response.data.success) {
        this.selectedDoctor = response.data.data;
        this.showDoctorModal();
      }
    } catch (error) {
      console.error('Error loading doctor:', error);
    }
  },
  
  async deleteDoctor(id) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    
    try {
      const response = await axios.delete(`${API_BASE}/doctors/${id}`);
      if (response.data.success) {
        this.showToast('Doctor deleted successfully', 'success');
        this.loadDoctors();
        this.loadStats();
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      this.showToast('Error deleting doctor', 'error');
    }
  },
  
  applyFilters() {
    const status = document.getElementById('filterStatus')?.value || '';
    const category = document.getElementById('filterCategory')?.value || '';
    const search = document.getElementById('searchInput')?.value || '';
    
    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;
    if (search) filters.search = search;
    
    this.loadDoctors(filters);
  },
  
  exportToCSV() {
    const headers = [
      'Doctor ID', 'Full Name', 'Gender', 'Mobile', 'Email', 'Specialization',
      'City', 'State', 'Category', 'Status', 'Years of Experience'
    ];
    
    const rows = this.doctors.map(d => [
      d.doctor_id, d.full_name, d.gender, d.mobile_number, d.email,
      d.specialization, d.city, d.state, d.doctor_category,
      d.engagement_status, d.years_of_experience
    ]);
    
    let csv = headers.join(',') + '\\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell || ''}"`).join(',') + '\\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `docpool-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    this.showToast('Data exported successfully', 'success');
  },
  
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white shadow-lg ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },
  
  showDoctorModal() {
    const d = this.selectedDoctor;
    if (!d) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold">${d.full_name}</h2>
              <p class="text-blue-100">${d.doctor_id}</p>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-200">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Core Details -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2">Core Details</h3>
              ${this.renderDetailRow('Gender', d.gender)}
              ${this.renderDetailRow('Date of Birth', d.date_of_birth)}
              ${this.renderDetailRow('Mobile', d.mobile_number)}
              ${this.renderDetailRow('Email', d.email)}
              ${this.renderDetailRow('WhatsApp', d.whatsapp_enabled ? 'Yes' : 'No')}
            </div>
            
            <!-- Professional -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2">Professional</h3>
              ${this.renderDetailRow('Qualification', d.primary_qualification)}
              ${this.renderDetailRow('Specialization', d.specialization)}
              ${this.renderDetailRow('Super Specialization', d.super_specialization)}
              ${this.renderDetailRow('Experience', d.years_of_experience ? `${d.years_of_experience} years` : null)}
              ${this.renderDetailRow('Registration No', d.medical_council_reg_no)}
            </div>
            
            <!-- Practice -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2">Practice & Work</h3>
              ${this.renderDetailRow('Practice Type', d.practice_type)}
              ${this.renderDetailRow('Hospital', d.primary_hospital_name)}
              ${this.renderDetailRow('Clinic', d.clinic_name)}
              ${this.renderDetailRow('Consultation Fee', d.consultation_fee ? `₹${d.consultation_fee}` : null)}
              ${this.renderDetailRow('Teleconsultation', d.teleconsultation_available ? 'Yes' : 'No')}
            </div>
            
            <!-- Location -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2">Location</h3>
              ${this.renderDetailRow('State', d.state)}
              ${this.renderDetailRow('City', d.city)}
              ${this.renderDetailRow('Area', d.area_locality)}
              ${this.renderDetailRow('PIN Code', d.pin_code)}
              ${this.renderDetailRow('Home Visit', d.home_visit_available ? 'Available' : 'Not Available')}
            </div>
            
            <!-- Digital Platform -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2">Digital Platform</h3>
              ${this.renderDetailRow('Mysaa', d.listed_on_mysaa ? 'Listed' : 'Not Listed')}
              ${this.renderDetailRow('DocSynapse', d.listed_on_docsynapse ? 'Listed' : 'Not Listed')}
              ${this.renderDetailRow('App Login', d.app_login_created ? 'Created' : 'Not Created')}
              ${this.renderDetailRow('Category', d.doctor_category)}
              ${this.renderDetailRow('CME Participation', d.cme_participation ? 'Yes' : 'No')}
            </div>
            
            <!-- Engagement -->
            <div class="space-y-4">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2">Engagement</h3>
              ${this.renderDetailRow('Status', d.engagement_status)}
              ${this.renderDetailRow('Last Interaction', d.last_interaction_date)}
              ${this.renderDetailRow('Last CME', d.last_cme_attended)}
              ${this.renderDetailRow('Last Referral', d.last_referral_date)}
              ${this.renderDetailRow('Relationship Manager', d.assigned_relationship_manager)}
            </div>
          </div>
          
          ${d.special_remarks ? `
            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-900 border-b pb-2 mb-3">Special Remarks</h3>
              <p class="text-gray-700 bg-gray-50 p-4 rounded-lg">${d.special_remarks}</p>
            </div>
          ` : ''}
          
          <div class="mt-6 flex space-x-3">
            <a href="/mobile" class="flex-1 bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700">
              <i class="fas fa-edit mr-2"></i>Edit in Mobile App
            </a>
            <button 
              onclick="dashboard.deleteDoctor(${d.id}); this.closest('.fixed').remove();"
              class="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
            >
              <i class="fas fa-trash mr-2"></i>Delete
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  },
  
  renderDetailRow(label, value) {
    if (!value) return '';
    return `
      <div class="flex justify-between">
        <span class="text-gray-600 text-sm">${label}:</span>
        <span class="text-gray-900 font-semibold text-sm">${value}</span>
      </div>
    `;
  },
  
  render() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-md sticky top-0 z-40">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i class="fas fa-user-md text-blue-600 text-3xl"></i>
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">DocPool Dashboard</h1>
                  <p class="text-sm text-gray-600">Doctor Information Management</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <a href="/mobile" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <i class="fas fa-plus mr-2"></i>Add Doctor
                </a>
                <button onclick="dashboard.exportToCSV()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                  <i class="fas fa-download mr-2"></i>Export CSV
                </button>
                <a href="/" class="text-gray-600 hover:text-gray-900">
                  <i class="fas fa-home text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Stats Cards -->
        <div id="statsContainer" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <!-- Stats will be rendered here -->
        </div>
        
        <!-- Filters -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div class="bg-white rounded-lg shadow-md p-4">
            <div class="grid md:grid-cols-4 gap-4">
              <input
                id="searchInput"
                type="search"
                placeholder="Search by name, mobile, email..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                oninput="dashboard.applyFilters()"
              />
              <select
                id="filterStatus"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onchange="dashboard.applyFilters()"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Dormant">Dormant</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select
                id="filterCategory"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onchange="dashboard.applyFilters()"
              >
                <option value="">All Categories</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
              <button
                onclick="document.getElementById('searchInput').value=''; document.getElementById('filterStatus').value=''; document.getElementById('filterCategory').value=''; dashboard.applyFilters();"
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                <i class="fas fa-redo mr-2"></i>Reset
              </button>
            </div>
          </div>
        </div>
        
        <!-- Doctor Table -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div id="doctorTableContainer">
              <!-- Table will be rendered here -->
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  renderStats() {
    const statsContainer = document.getElementById('statsContainer');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-semibold">Total Doctors</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">${this.stats.total || 0}</p>
            </div>
            <i class="fas fa-users text-blue-600 text-3xl"></i>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-semibold">Active</p>
              <p class="text-3xl font-bold text-green-600 mt-2">${this.stats.active || 0}</p>
            </div>
            <i class="fas fa-check-circle text-green-600 text-3xl"></i>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-semibold">Platinum</p>
              <p class="text-3xl font-bold text-purple-600 mt-2">${this.stats.platinum || 0}</p>
            </div>
            <i class="fas fa-crown text-purple-600 text-3xl"></i>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-semibold">Gold</p>
              <p class="text-3xl font-bold text-yellow-600 mt-2">${this.stats.gold || 0}</p>
            </div>
            <i class="fas fa-medal text-yellow-600 text-3xl"></i>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-semibold">Silver</p>
              <p class="text-3xl font-bold text-gray-600 mt-2">${this.stats.silver || 0}</p>
            </div>
            <i class="fas fa-award text-gray-600 text-3xl"></i>
          </div>
        </div>
      </div>
    `;
  },
  
  renderDoctorTable() {
    const container = document.getElementById('doctorTableContainer');
    if (!container) return;
    
    if (this.doctors.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
          <p class="text-gray-600 text-lg">No doctors found</p>
          <a href="/mobile" class="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            <i class="fas fa-plus mr-2"></i>Add First Doctor
          </a>
        </div>
      `;
      return;
    }
    
    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${this.doctors.map(doctor => `
              <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-user-md text-blue-600"></i>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">${doctor.full_name}</div>
                      <div class="text-sm text-gray-500">${doctor.mobile_number}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">${doctor.specialization || 'Not specified'}</div>
                  <div class="text-sm text-gray-500">${doctor.years_of_experience ? `${doctor.years_of_experience} years exp` : ''}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">${doctor.city || 'N/A'}</div>
                  <div class="text-sm text-gray-500">${doctor.state || ''}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    doctor.doctor_category === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                    doctor.doctor_category === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                    doctor.doctor_category === 'Silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }">
                    ${doctor.doctor_category || 'Uncategorized'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    doctor.engagement_status === 'Active' ? 'bg-green-100 text-green-800' :
                    doctor.engagement_status === 'Dormant' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }">
                    ${doctor.engagement_status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onclick="dashboard.viewDoctor(${doctor.id})"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <i class="fas fa-eye"></i> View
                  </button>
                  <button 
                    onclick="dashboard.deleteDoctor(${doctor.id})"
                    class="text-red-600 hover:text-red-900"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => dashboard.init());
