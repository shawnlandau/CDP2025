// Upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const photoFileInput = document.getElementById('photoFile');
    const filePreview = document.getElementById('filePreview');
    const previewImage = document.getElementById('previewImage');
    const removeFileBtn = document.getElementById('removeFile');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const uploadAnotherBtn = document.getElementById('uploadAnother');

    // Check authentication state
    firebaseAuth.onAuthStateChanged(function(user) {
        if (!user) {
            // User is not signed in, redirect to login
            window.location.href = 'login.html';
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        firebaseAuth.signOut().then(() => {
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    });

    // File input handling
    photoFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file (JPG, PNG, or GIF)');
                photoFileInput.value = '';
                return;
            }

            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                photoFileInput.value = '';
                return;
            }

            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                filePreview.style.display = 'block';
                document.querySelector('.file-input-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Remove file preview
    removeFileBtn.addEventListener('click', function() {
        photoFileInput.value = '';
        filePreview.style.display = 'none';
        document.querySelector('.file-input-placeholder').style.display = 'block';
    });

    // Upload another photo
    uploadAnotherBtn.addEventListener('click', function() {
        uploadForm.style.display = 'block';
        successMessage.style.display = 'none';
        uploadForm.reset();
        filePreview.style.display = 'none';
        document.querySelector('.file-input-placeholder').style.display = 'block';
    });

    // Handle form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const file = photoFileInput.files[0];
        if (!file) {
            alert('Please select a photo to upload');
            return;
        }

        // Get selected players
        const selectedPlayers = [];
        const playerCheckboxes = document.querySelectorAll('input[name="players"]:checked');
        playerCheckboxes.forEach(checkbox => {
            selectedPlayers.push(checkbox.value);
        });

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';

        // Upload file to Firebase Storage
        const storageRef = firebaseStorage.ref();
        const photoRef = storageRef.child(`photos/${Date.now()}_${file.name}`);
        
        photoRef.put(file)
            .then((snapshot) => {
                // Get download URL
                return snapshot.ref.getDownloadURL();
            })
            .then((downloadURL) => {
                // Save metadata to Firestore
                const photoData = {
                    imageUrl: downloadURL,
                    fileName: file.name,
                    fileSize: file.size,
                    uploadDate: firebase.firestore.FieldValue.serverTimestamp(),
                    uploadedBy: firebaseAuth.currentUser.email,
                    players: selectedPlayers
                };

                return firebaseDb.collection('photos').add(photoData);
            })
            .then(() => {
                // Show success message
                uploadForm.style.display = 'none';
                successMessage.style.display = 'block';
            })
            .catch((error) => {
                console.error('Error uploading photo:', error);
                
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'flex';
                btnLoading.style.display = 'none';
                
                // Show error message
                let errorMessage = 'An error occurred while uploading. Please try again.';
                
                if (error.code === 'storage/unauthorized') {
                    errorMessage = 'You are not authorized to upload photos. Please sign in again.';
                } else if (error.code === 'storage/quota-exceeded') {
                    errorMessage = 'Storage quota exceeded. Please contact the administrator.';
                }
                
                alert(errorMessage);
            });
    });
}); 