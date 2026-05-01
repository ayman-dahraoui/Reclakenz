import React from 'react';

function UploadProof() {
  return (
    <div>
      <h2>Ajout de photos/vidéos justificatives</h2>
      <input type="file" multiple accept="image/*,video/*" />
      {/* Tu pourras ajouter la logique d'envoi plus tard */}
    </div>
  );
}

export default UploadProof; 