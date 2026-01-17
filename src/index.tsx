import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// ============================================================================
// API ROUTES - Doctor Management
// ============================================================================

// Generate unique doctor ID
function generateDoctorId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `DOC-${year}-${random}`
}

// GET /api/doctors - List all doctors with optional filters
app.get('/api/doctors', async (c) => {
  const { env } = c
  const { status, category, specialization, city, state, search } = c.req.query()
  
  let query = 'SELECT * FROM doctors WHERE 1=1'
  const params: any[] = []
  
  if (status) {
    query += ' AND engagement_status = ?'
    params.push(status)
  }
  
  if (category) {
    query += ' AND doctor_category = ?'
    params.push(category)
  }
  
  if (specialization) {
    query += ' AND specialization LIKE ?'
    params.push(`%${specialization}%`)
  }
  
  if (city) {
    query += ' AND city LIKE ?'
    params.push(`%${city}%`)
  }
  
  if (state) {
    query += ' AND state LIKE ?'
    params.push(`%${state}%`)
  }
  
  if (search) {
    query += ' AND (full_name LIKE ? OR mobile_number LIKE ? OR email LIKE ?)'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  
  query += ' ORDER BY created_at DESC'
  
  try {
    const result = await env.DB.prepare(query).bind(...params).all()
    return c.json({ success: true, data: result.results, count: result.results.length })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET /api/doctors/:id - Get single doctor by ID
app.get('/api/doctors/:id', async (c) => {
  const { env } = c
  const id = c.req.param('id')
  
  try {
    const result = await env.DB.prepare('SELECT * FROM doctors WHERE id = ? OR doctor_id = ?')
      .bind(id, id)
      .first()
    
    if (!result) {
      return c.json({ success: false, error: 'Doctor not found' }, 404)
    }
    
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// POST /api/doctors - Create new doctor
app.post('/api/doctors', async (c) => {
  const { env } = c
  const data = await c.req.json()
  
  // Generate unique doctor ID
  const doctorId = generateDoctorId()
  
  try {
    const result = await env.DB.prepare(`
      INSERT INTO doctors (
        doctor_id, full_name, first_name, middle_name, last_name, 
        gender, date_of_birth, profile_photo_url,
        profile_photo, hospital_photo, logo_photo,
        mobile_number, email, whatsapp_enabled,
        primary_qualification, specialization, super_specialization,
        years_of_experience, experience_history, manual_experience_override,
        medical_council_reg_no, registration_council,
        registration_valid_till, practice_type, primary_hospital_name,
        secondary_hospitals, clinic_name, opd_days, opd_timings,
        consultation_fee, teleconsultation_available,
        working_places,
        state, city, area_locality, pin_code, google_maps_link,
        home_visit_available, listed_on_mysaa, listed_on_docsynapse,
        app_login_created, doctor_category, cme_participation,
        workshop_conductor, referral_capability, common_referral_specialties,
        op_strength_0_20, op_strength_20_50, op_strength_50_75, 
        op_strength_75_100, op_strength_100_plus,
        inbound_referrals, outbound_referrals, network_strength_score,
        payment_model, agreement_signed, agreement_start_date,
        agreement_end_date, gst_registered, gst_number,
        last_interaction_date, last_cme_attended, last_referral_date,
        engagement_status, assigned_relationship_manager,
        strategic_doctor, kol, special_remarks, compliance_flag
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `).bind(
      doctorId,
      data.full_name || '',
      data.first_name || null,
      data.middle_name || null,
      data.last_name || null,
      data.gender || null,
      data.date_of_birth || null,
      data.profile_photo_url || null,
      data.profile_photo || null,
      data.hospital_photo || null,
      data.logo_photo || null,
      data.mobile_number || '',
      data.email || null,
      data.whatsapp_enabled ? 1 : 0,
      data.primary_qualification || null,
      data.specialization || null,
      data.super_specialization || null,
      data.years_of_experience || null,
      data.experience_history ? JSON.stringify(data.experience_history) : null,
      data.manual_experience_override ? 1 : 0,
      data.medical_council_reg_no || null,
      data.registration_council || null,
      data.registration_valid_till || null,
      data.practice_type || null,
      data.primary_hospital_name || null,
      data.secondary_hospitals || null,
      data.clinic_name || null,
      data.opd_days || null,
      data.opd_timings || null,
      data.consultation_fee || null,
      data.teleconsultation_available ? 1 : 0,
      data.working_places ? JSON.stringify(data.working_places) : null,
      data.state || null,
      data.city || null,
      data.area_locality || null,
      data.pin_code || null,
      data.google_maps_link || null,
      data.home_visit_available ? 1 : 0,
      data.listed_on_mysaa ? 1 : 0,
      data.listed_on_docsynapse ? 1 : 0,
      data.app_login_created ? 1 : 0,
      data.doctor_category || null,
      data.cme_participation ? 1 : 0,
      data.workshop_conductor ? 1 : 0,
      data.referral_capability || null,
      data.common_referral_specialties || null,
      data.op_strength_0_20 ? 1 : 0,
      data.op_strength_20_50 ? 1 : 0,
      data.op_strength_50_75 ? 1 : 0,
      data.op_strength_75_100 ? 1 : 0,
      data.op_strength_100_plus ? 1 : 0,
      data.inbound_referrals ? 1 : 0,
      data.outbound_referrals ? 1 : 0,
      data.network_strength_score || null,
      data.payment_model || null,
      data.agreement_signed ? 1 : 0,
      data.agreement_start_date || null,
      data.agreement_end_date || null,
      data.gst_registered ? 1 : 0,
      data.gst_number || null,
      data.last_interaction_date || null,
      data.last_cme_attended || null,
      data.last_referral_date || null,
      data.engagement_status || 'Active',
      data.assigned_relationship_manager || null,
      data.strategic_doctor ? 1 : 0,
      data.kol ? 1 : 0,
      data.special_remarks || null,
      data.compliance_flag ? 1 : 0
    ).run()
    
    // Log activity
    await env.DB.prepare(`
      INSERT INTO activity_logs (doctor_id, activity_type, activity_description, performed_by)
      VALUES (?, 'created', 'Doctor profile created', 'system')
    `).bind(doctorId).run()
    
    return c.json({ 
      success: true, 
      message: 'Doctor created successfully',
      doctor_id: doctorId,
      id: result.meta.last_row_id 
    }, 201)
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// PUT /api/doctors/:id - Update doctor
app.put('/api/doctors/:id', async (c) => {
  const { env } = c
  const id = c.req.param('id')
  const data = await c.req.json()
  
  try {
    // Check if doctor exists
    const existing = await env.DB.prepare('SELECT doctor_id FROM doctors WHERE id = ? OR doctor_id = ?')
      .bind(id, id)
      .first()
    
    if (!existing) {
      return c.json({ success: false, error: 'Doctor not found' }, 404)
    }
    
    // Build dynamic update query
    const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'doctor_id')
    const setClause = fields.map(field => `${field} = ?`).join(', ')
    const values = fields.map(field => {
      // Convert boolean values to 0/1
      if (typeof data[field] === 'boolean') {
        return data[field] ? 1 : 0
      }
      return data[field]
    })
    
    await env.DB.prepare(`
      UPDATE doctors SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? OR doctor_id = ?
    `).bind(...values, id, id).run()
    
    // Log activity
    await env.DB.prepare(`
      INSERT INTO activity_logs (doctor_id, activity_type, activity_description, performed_by)
      VALUES (?, 'updated', 'Doctor profile updated', 'system')
    `).bind(existing.doctor_id).run()
    
    return c.json({ success: true, message: 'Doctor updated successfully' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// DELETE /api/doctors/:id - Delete doctor
app.delete('/api/doctors/:id', async (c) => {
  const { env } = c
  const id = c.req.param('id')
  
  try {
    const result = await env.DB.prepare('DELETE FROM doctors WHERE id = ? OR doctor_id = ?')
      .bind(id, id)
      .run()
    
    if (result.meta.changes === 0) {
      return c.json({ success: false, error: 'Doctor not found' }, 404)
    }
    
    return c.json({ success: true, message: 'Doctor deleted successfully' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET /api/stats - Get statistics
app.get('/api/stats', async (c) => {
  const { env } = c
  
  try {
    const total = await env.DB.prepare('SELECT COUNT(*) as count FROM doctors').first()
    const active = await env.DB.prepare('SELECT COUNT(*) as count FROM doctors WHERE engagement_status = ?').bind('Active').first()
    const platinum = await env.DB.prepare('SELECT COUNT(*) as count FROM doctors WHERE doctor_category = ?').bind('Platinum').first()
    const gold = await env.DB.prepare('SELECT COUNT(*) as count FROM doctors WHERE doctor_category = ?').bind('Gold').first()
    const silver = await env.DB.prepare('SELECT COUNT(*) as count FROM doctors WHERE doctor_category = ?').bind('Silver').first()
    
    return c.json({
      success: true,
      data: {
        total: total?.count || 0,
        active: active?.count || 0,
        platinum: platinum?.count || 0,
        gold: gold?.count || 0,
        silver: silver?.count || 0
      }
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// GET /api/activity-logs/:doctor_id - Get activity logs for a doctor
app.get('/api/activity-logs/:doctor_id', async (c) => {
  const { env } = c
  const doctorId = c.req.param('doctor_id')
  
  try {
    const result = await env.DB.prepare(`
      SELECT * FROM activity_logs WHERE doctor_id = ? ORDER BY created_at DESC LIMIT 50
    `).bind(doctorId).all()
    
    return c.json({ success: true, data: result.results })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ============================================================================
// FRONTEND ROUTES
// ============================================================================

// Mobile App Route
app.get('/mobile', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="theme-color" content="#2563eb">
        <title>DocPool - Mobile App</title>
        <link rel="manifest" href="/static/manifest.json">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          body { 
            overscroll-behavior: none;
            -webkit-overflow-scrolling: touch;
          }
          .mobile-container {
            max-width: 100vw;
            min-height: 100vh;
            padding-bottom: env(safe-area-inset-bottom);
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <div id="app" class="mobile-container"></div>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/mobile-app.js"></script>
    </body>
    </html>
  `)
})

// Web Dashboard Route
app.get('/dashboard', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DocPool - Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
        <div id="app"></div>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/dashboard.js"></script>
    </body>
    </html>
  `)
})

// Home Route - Landing page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DocPool - Doctor Information Management</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gradient-to-br from-blue-600 to-indigo-800 min-h-screen flex items-center justify-center p-4">
        <div class="max-w-4xl w-full">
            <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <div class="text-center mb-8">
                    <div class="inline-block bg-blue-100 p-4 rounded-full mb-4">
                        <i class="fas fa-user-md text-blue-600 text-5xl"></i>
                    </div>
                    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        DocPool
                    </h1>
                    <p class="text-xl text-gray-600">
                        Comprehensive Doctor Information Management System
                    </p>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6 mt-12">
                    <a href="/mobile" class="group block">
                        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white transform transition hover:scale-105 hover:shadow-xl">
                            <i class="fas fa-mobile-alt text-5xl mb-4"></i>
                            <h2 class="text-2xl font-bold mb-2">Mobile App</h2>
                            <p class="text-blue-100">Add and manage doctor information on the go</p>
                            <div class="mt-4 flex items-center text-sm font-semibold">
                                <span>Open Mobile App</span>
                                <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-2 transition"></i>
                            </div>
                        </div>
                    </a>
                    
                    <a href="/dashboard" class="group block">
                        <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 text-white transform transition hover:scale-105 hover:shadow-xl">
                            <i class="fas fa-chart-line text-5xl mb-4"></i>
                            <h2 class="text-2xl font-bold mb-2">Web Dashboard</h2>
                            <p class="text-indigo-100">View, analyze, and export doctor data</p>
                            <div class="mt-4 flex items-center text-sm font-semibold">
                                <span>Open Dashboard</span>
                                <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-2 transition"></i>
                            </div>
                        </div>
                    </a>
                </div>
                
                <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div class="p-4">
                        <i class="fas fa-shield-alt text-blue-600 text-3xl mb-2"></i>
                        <p class="text-sm text-gray-600 font-semibold">Secure</p>
                    </div>
                    <div class="p-4">
                        <i class="fas fa-bolt text-blue-600 text-3xl mb-2"></i>
                        <p class="text-sm text-gray-600 font-semibold">Fast</p>
                    </div>
                    <div class="p-4">
                        <i class="fas fa-mobile text-blue-600 text-3xl mb-2"></i>
                        <p class="text-sm text-gray-600 font-semibold">Mobile-First</p>
                    </div>
                    <div class="p-4">
                        <i class="fas fa-cloud text-blue-600 text-3xl mb-2"></i>
                        <p class="text-sm text-gray-600 font-semibold">Cloud-Based</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `)
})

export default app
