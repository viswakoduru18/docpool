# 🔌 DocPool API Documentation

Complete API reference for DocPool Doctor Information Management System.

---

## 📍 Base URL

**Local Development**: `http://localhost:3000`  
**Sandbox**: `https://3000-i321w3b6y5ke7u44rgdxx-c81df28e.sandbox.novita.ai`  
**Production**: `https://your-domain.pages.dev`

---

## 🔐 Authentication

Currently, no authentication is required. For production deployment, implement JWT-based authentication.

---

## 📋 API Endpoints

### **1. List All Doctors**

Get a list of all doctors with optional filtering.

```
GET /api/doctors
```

#### Query Parameters:
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `status` | string | Filter by engagement status | `Active`, `Dormant`, `Inactive` |
| `category` | string | Filter by doctor category | `Platinum`, `Gold`, `Silver` |
| `specialization` | string | Filter by specialization | `Cardiology` |
| `city` | string | Filter by city | `Mumbai` |
| `state` | string | Filter by state | `Maharashtra` |
| `search` | string | Search by name, mobile, or email | `John` |

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/doctors?status=Active&city=Mumbai"
```

#### Success Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "doctor_id": "DOC-2026-0001",
      "full_name": "Dr. John Kumar Doe",
      "first_name": "John",
      "middle_name": "Kumar",
      "last_name": "Doe",
      "gender": "Male",
      "mobile_number": "+91 9876543210",
      "email": "john.doe@example.com",
      "specialization": "Cardiology",
      "years_of_experience": 10,
      "city": "Mumbai",
      "state": "Maharashtra",
      "engagement_status": "Active",
      "doctor_category": "Platinum",
      "created_at": "2026-01-17T10:30:00.000Z",
      "updated_at": "2026-01-17T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

#### Error Response:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

### **2. Get Single Doctor**

Retrieve detailed information about a specific doctor.

```
GET /api/doctors/:id
```

#### URL Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer/string | Doctor's database ID or doctor_id |

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/doctors/1"
# OR
curl -X GET "http://localhost:3000/api/doctors/DOC-2026-0001"
```

#### Success Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "doctor_id": "DOC-2026-0001",
    "full_name": "Dr. John Kumar Doe",
    "first_name": "John",
    "middle_name": "Kumar",
    "last_name": "Doe",
    "gender": "Male",
    "date_of_birth": "1985-05-15",
    "profile_photo": "data:image/jpeg;base64,...",
    "hospital_photo": "data:image/jpeg;base64,...",
    "logo_photo": "data:image/jpeg;base64,...",
    "mobile_number": "+91 9876543210",
    "email": "john.doe@example.com",
    "whatsapp_enabled": 1,
    "primary_qualification": "MBBS",
    "specialization": "Cardiology",
    "super_specialization": "DM Cardiology",
    "years_of_experience": 10,
    "experience_history": "[{\"hospitalClinicName\":\"Apollo Hospital\",\"fromMonth\":1,\"fromYear\":2018,\"toMonth\":12,\"toYear\":2020,\"current\":false}]",
    "manual_experience_override": 0,
    "medical_council_reg_no": "MH/12345/2015",
    "registration_council": "Maharashtra Medical Council",
    "registration_valid_till": "2030-12-31",
    "practice_type": "Both",
    "consultation_fee": 500,
    "teleconsultation_available": 1,
    "working_places": "{\"hospital\":[{\"name\":\"Apollo Hospital\",\"days\":[\"Monday\",\"Tuesday\",\"Wednesday\"],\"startTime\":\"10:00\",\"endTime\":\"14:00\"}],\"clinic\":[{\"name\":\"Dr. John Clinic\",\"days\":[\"Monday\",\"Tuesday\",\"Wednesday\",\"Thursday\",\"Friday\",\"Saturday\"],\"startTime\":\"18:00\",\"endTime\":\"21:00\"}]}",
    "state": "Maharashtra",
    "city": "Mumbai",
    "area_locality": "Andheri West",
    "pin_code": "400053",
    "google_maps_link": "https://maps.google.com/...",
    "home_visit_available": 0,
    "listed_on_mysaa": 1,
    "listed_on_docsynapse": 1,
    "app_login_created": 1,
    "doctor_category": "Platinum",
    "cme_participation": 1,
    "workshop_conductor": 0,
    "referral_capability": "High",
    "common_referral_specialties": "Cardio, Neuro, Ortho",
    "op_strength_0_20": 0,
    "op_strength_20_50": 0,
    "op_strength_50_75": 1,
    "op_strength_75_100": 0,
    "op_strength_100_plus": 0,
    "inbound_referrals": 1,
    "outbound_referrals": 1,
    "network_strength_score": 8,
    "payment_model": "Fixed",
    "agreement_signed": 1,
    "agreement_start_date": "2025-01-01",
    "agreement_end_date": "2027-12-31",
    "gst_registered": 1,
    "gst_number": "27AABCU9603R1ZM",
    "last_interaction_date": "2026-01-15",
    "last_cme_attended": "2025-12-10",
    "last_referral_date": "2026-01-10",
    "engagement_status": "Active",
    "assigned_relationship_manager": "Sarah Smith",
    "strategic_doctor": 1,
    "kol": 1,
    "special_remarks": "Excellent referral network",
    "compliance_flag": 0,
    "created_at": "2026-01-17T10:30:00.000Z",
    "updated_at": "2026-01-17T10:30:00.000Z"
  }
}
```

#### Error Response:
```json
{
  "success": false,
  "error": "Doctor not found"
}
```

---

### **3. Create New Doctor**

Add a new doctor to the system.

```
POST /api/doctors
```

#### Request Headers:
```
Content-Type: application/json
```

#### Request Body:
```json
{
  "first_name": "John",
  "middle_name": "Kumar",
  "last_name": "Doe",
  "full_name": "Dr. John Kumar Doe",
  "gender": "Male",
  "date_of_birth": "1985-05-15",
  "profile_photo": "data:image/jpeg;base64,...",
  "hospital_photo": "data:image/jpeg;base64,...",
  "logo_photo": "data:image/jpeg;base64,...",
  "mobile_number": "+91 9876543210",
  "email": "john.doe@example.com",
  "whatsapp_enabled": true,
  "primary_qualification": "MBBS",
  "specialization": "Cardiology",
  "super_specialization": "DM Cardiology",
  "years_of_experience": 10,
  "experience_history": [
    {
      "hospitalClinicName": "Apollo Hospital",
      "fromMonth": 1,
      "fromYear": 2018,
      "toMonth": 12,
      "toYear": 2020,
      "current": false
    },
    {
      "hospitalClinicName": "Max Hospital",
      "fromMonth": 1,
      "fromYear": 2021,
      "toMonth": null,
      "toYear": null,
      "current": true
    }
  ],
  "manual_experience_override": false,
  "medical_council_reg_no": "MH/12345/2015",
  "registration_council": "Maharashtra Medical Council",
  "registration_valid_till": "2030-12-31",
  "practice_type": "Both",
  "consultation_fee": 500,
  "teleconsultation_available": true,
  "working_places": {
    "hospital": [
      {
        "name": "Apollo Hospital",
        "days": ["Monday", "Tuesday", "Wednesday"],
        "startTime": "10:00",
        "endTime": "14:00"
      }
    ],
    "clinic": [
      {
        "name": "Dr. John Clinic",
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "startTime": "18:00",
        "endTime": "21:00"
      }
    ]
  },
  "state": "Maharashtra",
  "city": "Mumbai",
  "area_locality": "Andheri West",
  "pin_code": "400053",
  "google_maps_link": "https://maps.google.com/...",
  "home_visit_available": false,
  "listed_on_mysaa": true,
  "listed_on_docsynapse": true,
  "app_login_created": true,
  "doctor_category": "Platinum",
  "cme_participation": true,
  "workshop_conductor": false,
  "common_referral_specialties": "Cardio, Neuro, Ortho",
  "op_strength_0_20": false,
  "op_strength_20_50": false,
  "op_strength_50_75": true,
  "op_strength_75_100": false,
  "op_strength_100_plus": false,
  "inbound_referrals": true,
  "outbound_referrals": true,
  "network_strength_score": 8,
  "payment_model": "Fixed",
  "agreement_signed": true,
  "agreement_start_date": "2025-01-01",
  "agreement_end_date": "2027-12-31",
  "gst_registered": true,
  "gst_number": "27AABCU9603R1ZM",
  "last_interaction_date": "2026-01-15",
  "last_cme_attended": "2025-12-10",
  "last_referral_date": "2026-01-10",
  "engagement_status": "Active",
  "assigned_relationship_manager": "Sarah Smith",
  "strategic_doctor": true,
  "kol": true,
  "special_remarks": "Excellent referral network",
  "compliance_flag": false
}
```

#### Example Request:
```bash
curl -X POST "http://localhost:3000/api/doctors" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "mobile_number": "+91 9876543210",
    "specialization": "Cardiology"
  }'
```

#### Success Response:
```json
{
  "success": true,
  "message": "Doctor created successfully",
  "doctor_id": "DOC-2026-0001",
  "id": 1
}
```

#### Error Response:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

### **4. Update Doctor**

Update existing doctor information.

```
PUT /api/doctors/:id
```

#### URL Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer/string | Doctor's database ID or doctor_id |

#### Request Headers:
```
Content-Type: application/json
```

#### Request Body:
Send only the fields you want to update.

```json
{
  "specialization": "Interventional Cardiology",
  "years_of_experience": 12,
  "engagement_status": "Active",
  "doctor_category": "Platinum"
}
```

#### Example Request:
```bash
curl -X PUT "http://localhost:3000/api/doctors/1" \
  -H "Content-Type: application/json" \
  -d '{
    "engagement_status": "Active",
    "doctor_category": "Platinum"
  }'
```

#### Success Response:
```json
{
  "success": true,
  "message": "Doctor updated successfully"
}
```

#### Error Response:
```json
{
  "success": false,
  "error": "Doctor not found"
}
```

---

### **5. Delete Doctor**

Remove a doctor from the system.

```
DELETE /api/doctors/:id
```

#### URL Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer/string | Doctor's database ID or doctor_id |

#### Example Request:
```bash
curl -X DELETE "http://localhost:3000/api/doctors/1"
```

#### Success Response:
```json
{
  "success": true,
  "message": "Doctor deleted successfully"
}
```

#### Error Response:
```json
{
  "success": false,
  "error": "Doctor not found"
}
```

---

### **6. Get Statistics**

Retrieve dashboard statistics.

```
GET /api/stats
```

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/stats"
```

#### Success Response:
```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 120,
    "platinum": 25,
    "gold": 45,
    "silver": 60
  }
}
```

#### Error Response:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

### **7. Get Activity Logs**

Retrieve activity logs for a specific doctor.

```
GET /api/activity-logs/:doctor_id
```

#### URL Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `doctor_id` | string | Doctor's unique ID (e.g., DOC-2026-0001) |

#### Example Request:
```bash
curl -X GET "http://localhost:3000/api/activity-logs/DOC-2026-0001"
```

#### Success Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "doctor_id": "DOC-2026-0001",
      "activity_type": "created",
      "activity_description": "Doctor profile created",
      "performed_by": "system",
      "created_at": "2026-01-17T10:30:00.000Z"
    },
    {
      "id": 2,
      "doctor_id": "DOC-2026-0001",
      "activity_type": "updated",
      "activity_description": "Doctor profile updated",
      "performed_by": "system",
      "created_at": "2026-01-17T11:30:00.000Z"
    }
  ]
}
```

#### Error Response:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 📊 Data Models

### **Doctor Object**

Complete doctor object structure:

```typescript
{
  // Core Identification
  id: number,
  doctor_id: string,              // Auto-generated: DOC-YYYY-XXXX
  first_name: string,
  middle_name: string | null,
  last_name: string,
  full_name: string,              // Auto: "Dr. [First] [Middle] [Last]"
  gender: "Male" | "Female" | "Other" | null,
  date_of_birth: string | null,   // ISO date format
  
  // Photos (Base64 encoded)
  profile_photo: string | null,
  hospital_photo: string | null,
  logo_photo: string | null,
  
  // Contact
  mobile_number: string,
  email: string | null,
  whatsapp_enabled: 0 | 1,
  
  // Professional Credentials
  primary_qualification: string | null,
  specialization: string | null,
  super_specialization: string | null,
  
  // Experience
  years_of_experience: number | null,
  experience_history: string | null,      // JSON array
  manual_experience_override: 0 | 1,
  
  medical_council_reg_no: string | null,
  registration_council: string | null,
  registration_valid_till: string | null,
  
  // Practice & Work
  practice_type: "Clinic" | "Hospital" | "Both" | null,
  consultation_fee: number | null,
  teleconsultation_available: 0 | 1,
  working_places: string | null,         // JSON object
  
  // Location
  state: string | null,
  city: string | null,
  area_locality: string | null,
  pin_code: string | null,
  google_maps_link: string | null,
  home_visit_available: 0 | 1,
  
  // Digital Platform
  listed_on_mysaa: 0 | 1,
  listed_on_docsynapse: 0 | 1,
  app_login_created: 0 | 1,
  doctor_category: "Platinum" | "Gold" | "Silver" | null,
  cme_participation: 0 | 1,
  workshop_conductor: 0 | 1,
  
  // Referral & Network
  referral_capability: "High" | "Medium" | "Low" | null,
  common_referral_specialties: string | null,
  
  // Daily OP Strength
  op_strength_0_20: 0 | 1,
  op_strength_20_50: 0 | 1,
  op_strength_50_75: 0 | 1,
  op_strength_75_100: 0 | 1,
  op_strength_100_plus: 0 | 1,
  
  inbound_referrals: 0 | 1,
  outbound_referrals: 0 | 1,
  network_strength_score: number | null,  // 1-10
  
  // Commercial
  payment_model: "Fixed" | "Revenue Share" | null,
  agreement_signed: 0 | 1,
  agreement_start_date: string | null,
  agreement_end_date: string | null,
  gst_registered: 0 | 1,
  gst_number: string | null,
  
  // Engagement
  last_interaction_date: string | null,
  last_cme_attended: string | null,
  last_referral_date: string | null,
  engagement_status: "Active" | "Dormant" | "Inactive",
  assigned_relationship_manager: string | null,
  
  // Internal Notes
  strategic_doctor: 0 | 1,
  kol: 0 | 1,
  special_remarks: string | null,
  compliance_flag: 0 | 1,
  
  // System
  created_at: string,              // ISO datetime
  updated_at: string               // ISO datetime
}
```

### **Experience History Object**

```typescript
{
  hospitalClinicName: string,
  fromMonth: number,               // 1-12
  fromYear: number,                // YYYY
  toMonth: number | null,          // 1-12 or null if current
  toYear: number | null,           // YYYY or null if current
  current: boolean                 // true if currently working
}
```

### **Working Places Object**

```typescript
{
  hospital: [
    {
      name: string,
      days: string[],              // ["Monday", "Tuesday", ...]
      startTime: string,           // "HH:MM" format
      endTime: string              // "HH:MM" format
    }
  ],
  clinic: [
    {
      name: string,
      days: string[],
      startTime: string,
      endTime: string
    }
  ]
}
```

---

## 🔄 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success - Request completed successfully |
| 201 | Created - Resource created successfully |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal server error |

---

## 💡 Usage Examples

### **Example 1: Create a Complete Doctor Profile**

```javascript
const doctorData = {
  first_name: "Rajesh",
  middle_name: "Kumar",
  last_name: "Sharma",
  full_name: "Dr. Rajesh Kumar Sharma",
  gender: "Male",
  mobile_number: "+91 9876543210",
  email: "rajesh.sharma@example.com",
  specialization: "Cardiology",
  years_of_experience: 15,
  experience_history: [
    {
      hospitalClinicName: "Apollo Hospital",
      fromMonth: 6,
      fromYear: 2010,
      toMonth: 5,
      toYear: 2015,
      current: false
    },
    {
      hospitalClinicName: "Fortis Hospital",
      fromMonth: 6,
      fromYear: 2015,
      toMonth: null,
      toYear: null,
      current: true
    }
  ],
  working_places: {
    hospital: [
      {
        name: "Fortis Hospital",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        startTime: "09:00",
        endTime: "17:00"
      }
    ],
    clinic: [
      {
        name: "Dr. Sharma's Clinic",
        days: ["Monday", "Wednesday", "Friday", "Saturday"],
        startTime: "18:00",
        endTime: "21:00"
      }
    ]
  },
  city: "Mumbai",
  state: "Maharashtra",
  engagement_status: "Active",
  doctor_category: "Platinum"
};

fetch('http://localhost:3000/api/doctors', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(doctorData)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### **Example 2: Search Active Cardiologists in Mumbai**

```javascript
fetch('http://localhost:3000/api/doctors?status=Active&specialization=Cardiology&city=Mumbai')
  .then(response => response.json())
  .then(data => {
    console.log(`Found ${data.count} cardiologists in Mumbai`);
    console.log(data.data);
  })
  .catch(error => console.error('Error:', error));
```

### **Example 3: Update Doctor's Engagement Status**

```javascript
fetch('http://localhost:3000/api/doctors/DOC-2026-0001', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    engagement_status: 'Active',
    last_interaction_date: new Date().toISOString().split('T')[0]
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### **Example 4: Get Statistics and Display**

```javascript
fetch('http://localhost:3000/api/stats')
  .then(response => response.json())
  .then(data => {
    const stats = data.data;
    console.log(`Total Doctors: ${stats.total}`);
    console.log(`Active: ${stats.active}`);
    console.log(`Platinum: ${stats.platinum}`);
    console.log(`Gold: ${stats.gold}`);
    console.log(`Silver: ${stats.silver}`);
  })
  .catch(error => console.error('Error:', error));
```

---

## 🛠️ Testing with cURL

### **List all doctors:**
```bash
curl -X GET "http://localhost:3000/api/doctors"
```

### **Search for doctors:**
```bash
curl -X GET "http://localhost:3000/api/doctors?search=John&city=Mumbai"
```

### **Get single doctor:**
```bash
curl -X GET "http://localhost:3000/api/doctors/1"
```

### **Create doctor:**
```bash
curl -X POST "http://localhost:3000/api/doctors" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "Doctor",
    "mobile_number": "+91 1234567890",
    "specialization": "General Medicine"
  }'
```

### **Update doctor:**
```bash
curl -X PUT "http://localhost:3000/api/doctors/1" \
  -H "Content-Type: application/json" \
  -d '{
    "engagement_status": "Active"
  }'
```

### **Delete doctor:**
```bash
curl -X DELETE "http://localhost:3000/api/doctors/1"
```

### **Get statistics:**
```bash
curl -X GET "http://localhost:3000/api/stats"
```

---

## 📝 Notes

### **Boolean Fields**
In the database, boolean fields are stored as integers (0 or 1). When sending data:
- `true` → converted to `1`
- `false` → converted to `0`

### **JSON Fields**
The following fields store JSON data as strings:
- `experience_history`
- `working_places`

They need to be parsed/stringified appropriately.

### **Date Format**
All dates should be in ISO 8601 format: `YYYY-MM-DD`

### **Auto-Generated Fields**
- `doctor_id`: Automatically generated in format `DOC-YYYY-XXXX`
- `created_at`: Set automatically on creation
- `updated_at`: Updated automatically on modification

### **Required Fields for Creation**
Minimum required fields to create a doctor:
- `first_name`
- `last_name`
- `mobile_number`
- `full_name` (can be auto-generated on frontend)

---

## 🔒 Security Recommendations

For production deployment:

1. **Add Authentication**: Implement JWT-based authentication
2. **Rate Limiting**: Prevent API abuse
3. **Input Validation**: Validate all inputs on server-side
4. **CORS Configuration**: Configure appropriate CORS policies
5. **HTTPS Only**: Use HTTPS in production
6. **API Keys**: Consider API key authentication
7. **Audit Logging**: Log all API calls for security

---

## 📧 Support

For API issues or questions, refer to:
- README.md
- SAVE_POINT.md
- Source code: `/home/user/webapp/src/index.tsx`

---

**Last Updated**: January 17, 2026  
**API Version**: 1.0.0  
**Documentation Version**: 1.0.0
