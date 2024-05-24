import React from 'react';

function ItemAdded({ name, src, price, quantity, removeQtt }) {
  return (
    <div className="ItemAdded">
      <div className="imgItem">
        <img src={src} alt={name} width="100" />
      </div>
      <div className="detailsItem">
        <h4>{name}</h4>
        <p>Prix : {price} €</p>
        <p>Quantité : {quantity}</p>
      </div>
      <div className="removeArticle">
        <button type="button" onClick={removeQtt}>Supprimer un article</button>
      </div>
    </div>
  );
}

export default ItemAdded;