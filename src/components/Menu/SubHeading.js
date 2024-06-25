import React from 'react';
import images from '../../assets/spoon.png';
import styles from '../Menu/search.module.css'; // Ensure this path is correct

const SubHeading = ({title}) => (
  <div className={styles.subHeading}>
    <p className={styles.subHeadingText}>{title}</p>
    <img src={images} alt='spoon' className={styles.spoon__img}/>
  </div>
);

export default SubHeading;
