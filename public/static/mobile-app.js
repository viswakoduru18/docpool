// DocPool Mobile App
// Mobile-first doctor information collection interface

const API_BASE = '/api';

const app = {
  currentView: 'list',
  currentDoctor: null,
  doctors: [],
  currentSection: 1,
  formData: {},
  
  init() {
    this.render();
    this.loadDoctors();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/static/sw.js').catch(console.error);
    }
  },
  
  async loadDoctors() {
    try {
      const response = await axios.get(`${API_BASE}/doctors`);
      if (response.data.success) {
        this.doctors = response.data.data;
        this.render();
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      this.showToast('Error loading doctors', 'error');
    }
  },
  
  async saveDoctor() {
    try {
      // Construct full name with Dr. prefix from first, middle, and last names
      const firstName = this.formData.first_name || '';
      const middleName = this.formData.middle_name || '';
      const lastName = this.formData.last_name || '';
      
      // Build full name with Dr. prefix
      let fullName = 'Dr.';
      if (firstName) fullName += ' ' + firstName;
      if (middleName) fullName += ' ' + middleName;
      if (lastName) fullName += ' ' + lastName;
      
      this.formData.full_name = fullName.trim();
      
      const method = this.currentDoctor ? 'put' : 'post';
      const url = this.currentDoctor 
        ? `${API_BASE}/doctors/${this.currentDoctor.id}`
        : `${API_BASE}/doctors`;
      
      const response = await axios[method](url, this.formData);
      
      if (response.data.success) {
        this.showToast('Doctor saved successfully!', 'success');
        this.formData = {};
        this.currentDoctor = null;
        this.currentSection = 1;
        this.showView('list');
        this.loadDoctors();
      }
    } catch (error) {
      console.error('Error saving doctor:', error);
      this.showToast('Error saving doctor', 'error');
    }
  },
  
  async deleteDoctor(id) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    
    try {
      const response = await axios.delete(`${API_BASE}/doctors/${id}`);
      if (response.data.success) {
        this.showToast('Doctor deleted successfully', 'success');
        this.loadDoctors();
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      this.showToast('Error deleting doctor', 'error');
    }
  },
  
  editDoctor(doctor) {
    this.currentDoctor = doctor;
    this.formData = { ...doctor };
    
    // Parse full_name back into first, middle, and last names
    if (doctor.full_name) {
      const nameParts = doctor.full_name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/);
      if (nameParts.length >= 3) {
        this.formData.first_name = nameParts[0];
        this.formData.middle_name = nameParts.slice(1, -1).join(' ');
        this.formData.last_name = nameParts[nameParts.length - 1];
      } else if (nameParts.length === 2) {
        this.formData.first_name = nameParts[0];
        this.formData.middle_name = '';
        this.formData.last_name = nameParts[1];
      } else if (nameParts.length === 1) {
        this.formData.first_name = nameParts[0];
        this.formData.middle_name = '';
        this.formData.last_name = '';
      }
    }
    
    this.currentSection = 1;
    this.showView('form');
  },
  
  showView(view) {
    this.currentView = view;
    this.render();
  },
  
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg text-white shadow-lg ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },
  
  nextSection() {
    if (this.currentSection < 9) {
      this.currentSection++;
      this.render();
      window.scrollTo(0, 0);
    }
  },
  
  prevSection() {
    if (this.currentSection > 1) {
      this.currentSection--;
      this.render();
      window.scrollTo(0, 0);
    }
  },
  
  render() {
    const appDiv = document.getElementById('app');
    
    if (this.currentView === 'list') {
      appDiv.innerHTML = this.renderDoctorList();
    } else if (this.currentView === 'form') {
      appDiv.innerHTML = this.renderDoctorForm();
    }
  },
  
  renderDoctorList() {
    return `
      <div class="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 pb-20">
        <!-- Header -->
        <div class="bg-white shadow-lg sticky top-0 z-40">
          <div class="px-4 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i class="fas fa-user-md text-blue-600 text-2xl"></i>
                <h1 class="text-2xl font-bold text-gray-900">DocPool</h1>
              </div>
              <div class="text-sm text-gray-600">
                ${this.doctors.length} Doctors
              </div>
            </div>
          </div>
        </div>
        
        <!-- Search -->
        <div class="px-4 py-4">
          <div class="relative">
            <input 
              type="search" 
              placeholder="Search doctors..." 
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              oninput="app.searchDoctors(this.value)"
            />
            <i class="fas fa-search absolute left-3 top-4 text-gray-400"></i>
          </div>
        </div>
        
        <!-- Doctor Cards -->
        <div class="px-4 space-y-3 pb-4">
          ${this.doctors.map(doctor => `
            <div class="bg-white rounded-xl shadow-md p-4 transform transition hover:scale-[1.02]">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-start space-x-3">
                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-user-md text-blue-600 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-gray-900 truncate">${doctor.full_name}</h3>
                      <p class="text-sm text-gray-600 truncate">${doctor.specialization || 'Not specified'}</p>
                      <div class="flex items-center space-x-2 mt-1">
                        <span class="text-xs px-2 py-1 rounded-full ${
                          doctor.doctor_category === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                          doctor.doctor_category === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                          doctor.doctor_category === 'Silver' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }">
                          ${doctor.doctor_category || 'Uncategorized'}
                        </span>
                        <span class="text-xs px-2 py-1 rounded-full ${
                          doctor.engagement_status === 'Active' ? 'bg-green-100 text-green-800' :
                          doctor.engagement_status === 'Dormant' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }">
                          ${doctor.engagement_status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                    <span><i class="fas fa-phone text-blue-500 mr-1"></i>${doctor.mobile_number}</span>
                    ${doctor.city ? `<span><i class="fas fa-map-marker-alt text-red-500 mr-1"></i>${doctor.city}</span>` : ''}
                  </div>
                </div>
              </div>
              
              <div class="mt-4 flex space-x-2">
                <button 
                  onclick="app.editDoctor(${JSON.stringify(doctor).replace(/"/g, '&quot;')})"
                  class="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
                >
                  <i class="fas fa-edit mr-1"></i> Edit
                </button>
                <button 
                  onclick="app.deleteDoctor(${doctor.id})"
                  class="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition"
                >
                  <i class="fas fa-trash mr-1"></i> Delete
                </button>
              </div>
            </div>
          `).join('') || '<div class="text-center py-12 text-white"><i class="fas fa-inbox text-5xl mb-4 opacity-50"></i><p class="text-lg">No doctors found</p></div>'}
        </div>
        
        <!-- Floating Add Button -->
        <button 
          onclick="app.showView('form')"
          class="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition transform hover:scale-110 z-50"
        >
          <i class="fas fa-plus text-2xl"></i>
        </button>
      </div>
    `;
  },
  
  renderDoctorForm() {
    const sections = [
      { id: 1, title: 'Core Details', icon: 'fa-user' },
      { id: 2, title: 'Professional Credentials', icon: 'fa-certificate' },
      { id: 3, title: 'Practice & Work', icon: 'fa-hospital' },
      { id: 4, title: 'Location', icon: 'fa-map-marker-alt' },
      { id: 5, title: 'Digital Platform', icon: 'fa-laptop' },
      { id: 6, title: 'Referral Network', icon: 'fa-network-wired' },
      { id: 7, title: 'Commercial', icon: 'fa-rupee-sign' },
      { id: 8, title: 'Engagement', icon: 'fa-chart-line' },
      { id: 9, title: 'Notes & Flags', icon: 'fa-flag' }
    ];
    
    return `
      <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg sticky top-0 z-40">
          <div class="px-4 py-4">
            <div class="flex items-center justify-between">
              <button onclick="app.showView('list')" class="text-white">
                <i class="fas fa-arrow-left text-xl"></i>
              </button>
              <h1 class="text-xl font-bold">
                ${this.currentDoctor ? 'Edit Doctor' : 'Add Doctor'}
              </h1>
              <div class="w-8"></div>
            </div>
          </div>
        </div>
        
        <!-- Progress Indicator -->
        <div class="bg-white border-b sticky top-[60px] z-30">
          <div class="px-4 py-3">
            <div class="flex items-center space-x-2 overflow-x-auto">
              ${sections.map(section => `
                <button 
                  onclick="app.currentSection = ${section.id}; app.render();"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    this.currentSection === section.id 
                      ? 'bg-blue-600 text-white' 
                      : this.currentSection > section.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }"
                >
                  ${section.id}
                </button>
              `).join('')}
            </div>
            <p class="text-sm text-gray-600 mt-2">
              <i class="fas ${sections[this.currentSection - 1].icon} mr-1"></i>
              ${sections[this.currentSection - 1].title}
            </p>
          </div>
        </div>
        
        <!-- Form Content -->
        <div class="px-4 py-6 pb-24">
          ${this.renderFormSection()}
        </div>
        
        <!-- Bottom Navigation -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
          <div class="flex space-x-3">
            ${this.currentSection > 1 ? `
              <button 
                onclick="app.prevSection()"
                class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
              >
                <i class="fas fa-arrow-left mr-2"></i>Previous
              </button>
            ` : ''}
            ${this.currentSection < 9 ? `
              <button 
                onclick="app.nextSection()"
                class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold"
              >
                Next<i class="fas fa-arrow-right ml-2"></i>
              </button>
            ` : `
              <button 
                onclick="app.saveDoctor()"
                class="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold"
              >
                <i class="fas fa-save mr-2"></i>Save Doctor
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },
  
  renderFormSection() {
    const fd = this.formData;
    
    switch (this.currentSection) {
      case 1: // Core Details
        return `
          <div class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label class="block text-sm font-semibold text-gray-700 mb-3">
                <i class="fas fa-user-md mr-2"></i>Doctor's Name (Dr. prefix will be added automatically)
              </label>
              <div class="space-y-3">
                ${this.renderInput('first_name', 'First Name', 'text', 'John', true)}
                ${this.renderInput('middle_name', 'Middle Name', 'text', 'Kumar')}
                ${this.renderInput('last_name', 'Last Name', 'text', 'Doe', true)}
              </div>
              <div class="mt-3 p-3 bg-white rounded border border-blue-300">
                <p class="text-xs text-gray-600 mb-1">Preview:</p>
                <p id="namePreview" class="font-semibold text-blue-700">
                  Dr. ${this.formData.first_name || '[First]'} ${this.formData.middle_name || ''} ${this.formData.last_name || '[Last]'}
                </p>
              </div>
            </div>
            ${this.renderSelect('gender', 'Gender', ['Male', 'Female', 'Other'])}
            ${this.renderInput('date_of_birth', 'Date of Birth', 'date')}
            ${this.renderInput('mobile_number', 'Mobile Number', 'tel', '+91 9876543210', true)}
            ${this.renderInput('email', 'Email ID', 'email', 'doctor@example.com')}
            ${this.renderCheckbox('whatsapp_enabled', 'WhatsApp Enabled')}
            
            <!-- Photo Upload Section -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <label class="block text-sm font-semibold text-gray-700 mb-3">
                <i class="fas fa-camera mr-2"></i>Photos
              </label>
              <div class="space-y-3">
                ${this.renderPhotoUpload('profile_photo', 'Profile Photo', 'fa-user-circle')}
                ${this.renderPhotoUpload('hospital_photo', 'Hospital/Clinic Photo', 'fa-hospital')}
                ${this.renderPhotoUpload('logo_photo', 'Logo (if any)', 'fa-image')}
              </div>
            </div>
          </div>
        `;
        
      case 2: // Professional Credentials
        return `
          <div class="space-y-4">
            ${this.renderInput('primary_qualification', 'Primary Qualification', 'text', 'MBBS')}
            ${this.renderInput('specialization', 'Specialization', 'text', 'Cardiology')}
            ${this.renderInput('super_specialization', 'Super Specialization', 'text', 'DM Cardiology')}
            ${this.renderInput('years_of_experience', 'Years of Experience', 'number', '10')}
            ${this.renderInput('medical_council_reg_no', 'Medical Council Registration No', 'text')}
            ${this.renderInput('registration_council', 'Registration Council', 'text', 'State Medical Council')}
            ${this.renderInput('registration_valid_till', 'Registration Valid Till', 'date')}
          </div>
        `;
        
      case 3: // Practice & Work
        return `
          <div class="space-y-4">
            ${this.renderSelect('practice_type', 'Practice Type', ['Clinic', 'Hospital', 'Both'])}
            ${this.renderInput('consultation_fee', 'Consultation Fee (₹)', 'number', '500')}
            ${this.renderCheckbox('teleconsultation_available', 'Teleconsultation Available')}
            
            <!-- Hospital/Clinic Working Details -->
            <div class="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-semibold text-gray-700">
                  <i class="fas fa-hospital mr-2"></i>Hospital Details
                </label>
                <button 
                  type="button"
                  onclick="app.addWorkingPlace('hospital')"
                  class="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700"
                >
                  <i class="fas fa-plus mr-1"></i>Add
                </button>
              </div>
              <div id="hospitalList" class="space-y-3">
                ${this.renderWorkingPlaces('hospital')}
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-semibold text-gray-700">
                  <i class="fas fa-clinic-medical mr-2"></i>Clinic Details
                </label>
                <button 
                  type="button"
                  onclick="app.addWorkingPlace('clinic')"
                  class="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700"
                >
                  <i class="fas fa-plus mr-1"></i>Add
                </button>
              </div>
              <div id="clinicList" class="space-y-3">
                ${this.renderWorkingPlaces('clinic')}
              </div>
            </div>
          </div>
        `;
        
      case 4: // Location
        return `
          <div class="space-y-4">
            ${this.renderInput('state', 'State', 'text', 'Maharashtra')}
            ${this.renderInput('city', 'City', 'text', 'Mumbai')}
            ${this.renderInput('area_locality', 'Area / Locality', 'text', 'Andheri West')}
            ${this.renderInput('pin_code', 'PIN Code', 'text', '400053')}
            ${this.renderInput('google_maps_link', 'Google Maps Link', 'url')}
            ${this.renderCheckbox('home_visit_available', 'Home Visit Available')}
          </div>
        `;
        
      case 5: // Digital Platform
        return `
          <div class="space-y-4">
            ${this.renderCheckbox('listed_on_mysaa', 'Listed on Mysaa')}
            ${this.renderCheckbox('listed_on_docsynapse', 'Listed on DocSynapse')}
            ${this.renderCheckbox('app_login_created', 'App Login Created')}
            ${this.renderSelect('doctor_category', 'Doctor Category', ['Platinum', 'Gold', 'Silver'])}
            ${this.renderCheckbox('cme_participation', 'CME Participation')}
            ${this.renderCheckbox('workshop_conductor', 'Workshop Conductor')}
          </div>
        `;
        
      case 6: // Referral Network
        return `
          <div class="space-y-4">
            <!-- Daily OP Strength -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <label class="block text-sm font-semibold text-gray-700 mb-3">
                <i class="fas fa-users mr-2"></i>Daily OP Strength (Select applicable ranges)
              </label>
              <div class="space-y-2">
                ${this.renderCheckbox('op_strength_0_20', '0-20 patients/day')}
                ${this.renderCheckbox('op_strength_20_50', '20-50 patients/day')}
                ${this.renderCheckbox('op_strength_50_75', '50-75 patients/day')}
                ${this.renderCheckbox('op_strength_75_100', '75-100 patients/day')}
                ${this.renderCheckbox('op_strength_100_plus', '100+ patients/day')}
              </div>
            </div>
            
            ${this.renderInput('common_referral_specialties', 'Common Referral Specialties', 'text', 'Cardio, Neuro, Ortho')}
            ${this.renderCheckbox('inbound_referrals', 'Inbound Referrals')}
            ${this.renderCheckbox('outbound_referrals', 'Outbound Referrals')}
            ${this.renderInput('network_strength_score', 'Network Strength Score (1-10)', 'number', '7')}
          </div>
        `;
        
      case 7: // Commercial
        return `
          <div class="space-y-4">
            ${this.renderSelect('payment_model', 'Payment Model', ['Fixed', 'Revenue Share'])}
            ${this.renderCheckbox('agreement_signed', 'Agreement Signed')}
            ${this.renderInput('agreement_start_date', 'Agreement Start Date', 'date')}
            ${this.renderInput('agreement_end_date', 'Agreement End Date', 'date')}
            ${this.renderCheckbox('gst_registered', 'GST Registered')}
            ${this.renderInput('gst_number', 'GST Number', 'text')}
          </div>
        `;
        
      case 8: // Engagement
        return `
          <div class="space-y-4">
            ${this.renderInput('last_interaction_date', 'Last Interaction Date', 'date')}
            ${this.renderInput('last_cme_attended', 'Last CME Attended', 'date')}
            ${this.renderInput('last_referral_date', 'Last Referral Date', 'date')}
            ${this.renderSelect('engagement_status', 'Engagement Status', ['Active', 'Dormant', 'Inactive'])}
            ${this.renderInput('assigned_relationship_manager', 'Assigned Relationship Manager', 'text')}
          </div>
        `;
        
      case 9: // Notes & Flags
        return `
          <div class="space-y-4">
            ${this.renderCheckbox('strategic_doctor', 'Strategic Doctor')}
            ${this.renderCheckbox('kol', 'Key Opinion Leader (KOL)')}
            ${this.renderCheckbox('compliance_flag', 'Compliance Flag')}
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Special Remarks</label>
              <textarea
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Any special notes or remarks..."
                onchange="app.formData.special_remarks = this.value"
              >${fd.special_remarks || ''}</textarea>
            </div>
          </div>
        `;
        
      default:
        return '<div>Section not found</div>';
    }
  },
  
  updateNamePreview() {
    const previewEl = document.getElementById('namePreview');
    if (previewEl) {
      const firstName = this.formData.first_name || '[First]';
      const middleName = this.formData.middle_name || '';
      const lastName = this.formData.last_name || '[Last]';
      previewEl.textContent = `Dr. ${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim();
    }
  },
  
  renderInput(name, label, type, placeholder, required) {
    const value = this.formData[name] || '';
    // Add oninput for name fields to update preview without re-rendering
    const isNameField = ['first_name', 'middle_name', 'last_name'].includes(name);
    const inputHandler = isNameField 
      ? `oninput="app.formData.${name} = this.value; app.updateNamePreview();"` 
      : `onchange="app.formData.${name} = this.value"`;
    
    return `
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          ${label}${required ? '<span class="text-red-500">*</span>' : ''}
        </label>
        <input
          type="${type}"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="${placeholder || ''}"
          value="${value}"
          ${inputHandler}
          ${required ? 'required' : ''}
        />
      </div>
    `;
  },
  
  renderSelect(name, label, options) {
    const value = this.formData[name] || '';
    return `
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">${label}</label>
        <select
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onchange="app.formData.${name} = this.value"
        >
          <option value="">Select ${label}</option>
          ${options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
        </select>
      </div>
    `;
  },
  
  renderCheckbox(name, label) {
    const checked = this.formData[name] ? 'checked' : '';
    return `
      <div class="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
        <input
          type="checkbox"
          id="${name}"
          class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          ${checked}
          onchange="app.formData.${name} = this.checked"
        />
        <label for="${name}" class="text-sm font-semibold text-gray-700">${label}</label>
      </div>
    `;
  },
  
  renderPhotoUpload(name, label, icon) {
    const photoData = this.formData[name] || '';
    return `
      <div class="bg-white rounded-lg p-3 border border-gray-200">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          <i class="fas ${icon} mr-2"></i>${label}
        </label>
        <div class="flex items-center space-x-2">
          <input
            type="file"
            id="${name}_file"
            accept="image/*"
            capture="environment"
            class="hidden"
            onchange="app.handlePhotoUpload(event, '${name}')"
          />
          <button
            type="button"
            onclick="document.getElementById('${name}_file').click()"
            class="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-blue-200 transition"
          >
            <i class="fas fa-camera mr-2"></i>Take Photo
          </button>
          <button
            type="button"
            onclick="document.getElementById('${name}_file').click(); document.getElementById('${name}_file').removeAttribute('capture');"
            class="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-green-200 transition"
          >
            <i class="fas fa-upload mr-2"></i>Upload
          </button>
        </div>
        ${photoData ? `
          <div class="mt-2 relative">
            <img src="${photoData}" class="w-full h-32 object-cover rounded-lg" />
            <button
              type="button"
              onclick="app.removePhoto('${name}')"
              class="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        ` : ''}
      </div>
    `;
  },
  
  handlePhotoUpload(event, fieldName) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData[fieldName] = e.target.result;
        this.render();
      };
      reader.readAsDataURL(file);
    }
  },
  
  removePhoto(fieldName) {
    this.formData[fieldName] = '';
    this.render();
  },
  
  renderWorkingPlaces(type) {
    if (!this.formData.working_places) {
      this.formData.working_places = { hospital: [], clinic: [] };
    }
    
    const places = this.formData.working_places[type] || [];
    
    if (places.length === 0) {
      return `
        <div class="text-center py-4 text-gray-500 text-sm">
          <i class="fas fa-info-circle mr-2"></i>No ${type} added yet
        </div>
      `;
    }
    
    return places.map((place, index) => `
      <div class="bg-white rounded-lg p-3 border border-gray-300">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-semibold text-gray-800">${place.name}</h4>
          <button
            type="button"
            onclick="app.removeWorkingPlace('${type}', ${index})"
            class="text-red-600 hover:text-red-800"
          >
            <i class="fas fa-trash text-sm"></i>
          </button>
        </div>
        <div class="text-xs text-gray-600 space-y-1">
          <div><i class="fas fa-calendar mr-1"></i>${place.days.join(', ')}</div>
          <div><i class="fas fa-clock mr-1"></i>${place.startTime} - ${place.endTime}</div>
        </div>
      </div>
    `).join('');
  },
  
  addWorkingPlace(type) {
    // Create modal for adding working place
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">Add ${type === 'hospital' ? 'Hospital' : 'Clinic'}</h3>
            <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-200">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
        
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              ${type === 'hospital' ? 'Hospital' : 'Clinic'} Name *
            </label>
            <input
              type="text"
              id="place_name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Working Days *
            </label>
            <div class="space-y-2">
              <button
                type="button"
                onclick="app.toggleAllDays()"
                class="w-full bg-purple-100 text-purple-700 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-purple-200 transition"
              >
                <i class="fas fa-check-double mr-2"></i>Select All Days
              </button>
              <div class="grid grid-cols-2 gap-2">
                ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => `
                  <label class="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                    <input type="checkbox" class="day-checkbox rounded" value="${day}" />
                    <span class="text-sm">${day}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                id="start_time"
                value="10:00"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                id="end_time"
                value="19:00"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            type="button"
            onclick="app.saveWorkingPlace('${type}')"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <i class="fas fa-save mr-2"></i>Save
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  },
  
  toggleAllDays() {
    const checkboxes = document.querySelectorAll('.day-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
  },
  
  saveWorkingPlace(type) {
    const name = document.getElementById('place_name').value;
    const startTime = document.getElementById('start_time').value;
    const endTime = document.getElementById('end_time').value;
    const dayCheckboxes = document.querySelectorAll('.day-checkbox:checked');
    const days = Array.from(dayCheckboxes).map(cb => cb.value);
    
    if (!name) {
      alert('Please enter a name');
      return;
    }
    
    if (days.length === 0) {
      alert('Please select at least one day');
      return;
    }
    
    if (!this.formData.working_places) {
      this.formData.working_places = { hospital: [], clinic: [] };
    }
    
    this.formData.working_places[type].push({
      name,
      days,
      startTime,
      endTime
    });
    
    // Close modal
    document.querySelector('.fixed').remove();
    
    // Re-render section
    this.render();
    
    this.showToast(`${type === 'hospital' ? 'Hospital' : 'Clinic'} added successfully`, 'success');
  },
  
  removeWorkingPlace(type, index) {
    if (confirm('Remove this place?')) {
      this.formData.working_places[type].splice(index, 1);
      this.render();
    }
  }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => app.init());
