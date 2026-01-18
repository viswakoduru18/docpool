# 🚀 DocPool API Quick Reference

One-page reference for all API endpoints.

---

## 📍 Base URL
```
http://localhost:3000
```

---

## 🔌 Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List all doctors (with filters) |
| GET | `/api/doctors/:id` | Get single doctor |
| POST | `/api/doctors` | Create new doctor |
| PUT | `/api/doctors/:id` | Update doctor |
| DELETE | `/api/doctors/:id` | Delete doctor |
| GET | `/api/stats` | Get statistics |
| GET | `/api/activity-logs/:doctor_id` | Get activity logs |

---

## 📋 Quick Commands

### List All Doctors
```bash
curl http://localhost:3000/api/doctors
```

### Filter Active Doctors
```bash
curl "http://localhost:3000/api/doctors?status=Active"
```

### Search by City
```bash
curl "http://localhost:3000/api/doctors?city=Mumbai"
```

### Get Single Doctor
```bash
curl http://localhost:3000/api/doctors/1
```

### Create Doctor (Minimal)
```bash
curl -X POST http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "Dr. John Doe",
    "mobile_number": "+91 9876543210"
  }'
```

### Update Doctor
```bash
curl -X PUT http://localhost:3000/api/doctors/1 \
  -H "Content-Type: application/json" \
  -d '{"engagement_status": "Active"}'
```

### Delete Doctor
```bash
curl -X DELETE http://localhost:3000/api/doctors/1
```

### Get Statistics
```bash
curl http://localhost:3000/api/stats
```

---

## 🔍 Query Parameters

### For `/api/doctors`:
| Parameter | Example | Description |
|-----------|---------|-------------|
| `status` | `Active` | Filter by engagement status |
| `category` | `Platinum` | Filter by doctor category |
| `specialization` | `Cardiology` | Filter by specialization |
| `city` | `Mumbai` | Filter by city |
| `state` | `Maharashtra` | Filter by state |
| `search` | `John` | Search name/mobile/email |

**Example with multiple filters:**
```bash
curl "http://localhost:3000/api/doctors?status=Active&city=Mumbai&category=Platinum"
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // Only for list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 💾 Required Fields (Minimum)

To create a doctor, you need:
- `first_name` ✅
- `last_name` ✅
- `full_name` ✅
- `mobile_number` ✅

---

## 🎯 Common Scenarios

### Scenario 1: Add Doctor with Photos
```javascript
{
  "first_name": "John",
  "last_name": "Doe",
  "full_name": "Dr. John Doe",
  "mobile_number": "+91 9876543210",
  "profile_photo": "data:image/jpeg;base64,...",
  "hospital_photo": "data:image/jpeg;base64,...",
  "logo_photo": "data:image/jpeg;base64,..."
}
```

### Scenario 2: Add Work Experience
```javascript
{
  "first_name": "John",
  "last_name": "Doe",
  "experience_history": [
    {
      "hospitalClinicName": "Apollo Hospital",
      "fromMonth": 1,
      "fromYear": 2020,
      "toMonth": null,
      "toYear": null,
      "current": true
    }
  ]
}
```

### Scenario 3: Add Working Places
```javascript
{
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
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "startTime": "18:00",
        "endTime": "21:00"
      }
    ]
  }
}
```

### Scenario 4: Set OP Strength
```javascript
{
  "op_strength_50_75": true,
  "op_strength_75_100": false
}
```

---

## 🔢 Field Value References

### Enums

**Gender:**
- `"Male"`
- `"Female"`
- `"Other"`

**Practice Type:**
- `"Clinic"`
- `"Hospital"`
- `"Both"`

**Doctor Category:**
- `"Platinum"`
- `"Gold"`
- `"Silver"`

**Engagement Status:**
- `"Active"`
- `"Dormant"`
- `"Inactive"`

**Payment Model:**
- `"Fixed"`
- `"Revenue Share"`

**Referral Capability:**
- `"High"`
- `"Medium"`
- `"Low"`

### Boolean Fields (send as true/false, stored as 0/1)
- `whatsapp_enabled`
- `teleconsultation_available`
- `home_visit_available`
- `listed_on_mysaa`
- `listed_on_docsynapse`
- `app_login_created`
- `cme_participation`
- `workshop_conductor`
- `op_strength_0_20`
- `op_strength_20_50`
- `op_strength_50_75`
- `op_strength_75_100`
- `op_strength_100_plus`
- `inbound_referrals`
- `outbound_referrals`
- `agreement_signed`
- `gst_registered`
- `strategic_doctor`
- `kol`
- `compliance_flag`
- `manual_experience_override`

---

## 📱 JavaScript Examples

### Fetch All Doctors
```javascript
fetch('http://localhost:3000/api/doctors')
  .then(res => res.json())
  .then(data => console.log(data.data));
```

### Create Doctor
```javascript
fetch('http://localhost:3000/api/doctors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'Dr. John Doe',
    mobile_number: '+91 9876543210'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Update Doctor
```javascript
fetch('http://localhost:3000/api/doctors/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    engagement_status: 'Active'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🐍 Python Examples

### Using requests library

```python
import requests

# List doctors
response = requests.get('http://localhost:3000/api/doctors')
doctors = response.json()['data']

# Create doctor
data = {
    'first_name': 'John',
    'last_name': 'Doe',
    'full_name': 'Dr. John Doe',
    'mobile_number': '+91 9876543210'
}
response = requests.post('http://localhost:3000/api/doctors', json=data)
print(response.json())

# Update doctor
update_data = {'engagement_status': 'Active'}
response = requests.put('http://localhost:3000/api/doctors/1', json=update_data)
print(response.json())

# Delete doctor
response = requests.delete('http://localhost:3000/api/doctors/1')
print(response.json())
```

---

## 📊 Postman Collection

Import this as a Postman collection:

```json
{
  "info": {
    "name": "DocPool API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "List Doctors",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/doctors",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "doctors"]
        }
      }
    },
    {
      "name": "Get Doctor",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/doctors/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "doctors", "1"]
        }
      }
    },
    {
      "name": "Create Doctor",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"first_name\": \"John\",\n  \"last_name\": \"Doe\",\n  \"full_name\": \"Dr. John Doe\",\n  \"mobile_number\": \"+91 9876543210\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/doctors",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "doctors"]
        }
      }
    },
    {
      "name": "Update Doctor",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"engagement_status\": \"Active\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/doctors/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "doctors", "1"]
        }
      }
    },
    {
      "name": "Delete Doctor",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/doctors/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "doctors", "1"]
        }
      }
    },
    {
      "name": "Get Statistics",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/stats",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "stats"]
        }
      }
    }
  ]
}
```

---

## 🔗 Related Documentation

- **Full API Docs**: `API_DOCUMENTATION.md`
- **Project README**: `README.md`
- **Save Point**: `SAVE_POINT.md`

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: January 17, 2026
