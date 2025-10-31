# Testing Guide - Database Synchronization Fix

## Quick Test (2 minutes)

### Step 1: Open Admin Dashboard
1. Go to `http://localhost:3000/admin/login`
2. Login with your credentials
3. Go to the "Content" tab

### Step 2: Make a Change
1. Change the "Female Name" from "Maii" to "Test Update"
2. Click "Save Changes"
3. Wait for the success message ✅

### Step 3: Verify Persistence
1. **Refresh the page** (Ctrl+R or Cmd+R)
2. Check if "Test Update" is still there
3. If YES ✅ - Fix is working!
4. If NO ❌ - Problem still exists

### Step 4: Check Website
1. Open the website in a new tab: `http://localhost:3000`
2. Check if the female name shows "Test Update"
3. If YES ✅ - Full sync is working!
4. If NO ❌ - Frontend sync issue

---

## Detailed Test (5 minutes)

### Test 1: Text Content Update
```
1. Admin Dashboard → Content Tab
2. Change Male Name to "Test Male"
3. Change Female Name to "Test Female"
4. Change Tagline to "Test Tagline"
5. Click Save
6. Verify success message
7. Refresh page
8. Verify all changes are still there
9. Open website in new tab
10. Verify changes appear on website
```

### Test 2: Image Upload
```
1. Admin Dashboard → Images Tab
2. Upload an image
3. Verify success message
4. Refresh page
5. Verify image is still there
6. Open website in new tab
7. Verify image appears in gallery
```

### Test 3: Image Delete
```
1. Admin Dashboard → Images Tab
2. Hover over an image
3. Click Delete
4. Confirm deletion
5. Verify success message
6. Refresh page
7. Verify image is gone
8. Open website in new tab
9. Verify image is gone from gallery
```

### Test 4: Song Upload
```
1. Admin Dashboard → Music Tab
2. Upload a song
3. Verify success message
4. Refresh page
5. Verify song player is still there
6. Open website in new tab
7. Verify song appears on website
```

### Test 5: Multi-Tab Sync
```
1. Open Admin Dashboard in Tab A
2. Open Website in Tab B
3. Make a change in Tab A
4. Click Save
5. Switch to Tab B
6. Wait 1-2 seconds
7. Verify change appears in Tab B
8. Refresh Tab B
9. Verify change persists
```

---

## Debugging Commands

### Check Database State
```bash
node debug-db.js
```
This will show:
- Total documents in collection
- Current values of all fields
- Whether database is clean (only 1 document)

### Test API Directly
```bash
node test-api.js
```
This will:
- Read current data
- Update data
- Wait 200ms
- Read fresh data
- Verify update worked
- Revert changes

---

## Expected Behavior

### ✅ Correct Behavior
- Changes appear immediately in admin dashboard
- Changes persist after page refresh
- Changes appear on website within 1-2 seconds
- Multiple tabs stay in sync
- No data loss or rollback

### ❌ Incorrect Behavior
- Changes disappear after refresh
- Changes don't appear on website
- Different tabs show different data
- Data reverts to old values
- Errors in browser console

---

## Troubleshooting

### If changes disappear after refresh:
1. Check browser console for errors
2. Run `node debug-db.js` to verify database state
3. Check if there are multiple documents (should be only 1)
4. Check MongoDB connection string in `.env.local`

### If changes don't appear on website:
1. Check if website is polling (should see requests every 1 second)
2. Open browser DevTools → Network tab
3. Look for `/api/content` requests
4. Check if responses contain updated data
5. Check browser console for errors

### If multiple documents exist:
1. Run cleanup: Go to admin dashboard
2. It will automatically cleanup on startup
3. Or manually run: `node debug-db.js` to verify

---

## Performance Expectations

- Admin save: 300-500ms
- Website update: 1-2 seconds
- Image upload: 2-5 seconds (depends on file size)
- Page refresh: 1-2 seconds

---

## Success Criteria

All of these should be true:
- ✅ Changes persist after page refresh
- ✅ Changes appear on website within 2 seconds
- ✅ Multiple tabs stay in sync
- ✅ No errors in browser console
- ✅ No errors in server logs
- ✅ Database has only 1 document
- ✅ All API responses include fresh data

If all criteria are met, the fix is working correctly!
