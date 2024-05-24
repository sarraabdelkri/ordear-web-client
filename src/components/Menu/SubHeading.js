import React from 'react';
import images from '../../assets/spoon.png';
import styles from '../Menu/search.module.css';

const SubHeading = ({title}) => (
  <div style={{ marginBottom : '1rem' ,marginTop:"5%"}}>
    <p  className={styles.app__headerh2}>{title}</p>
    <img src={images} alt='spoon' className='spoon__img'/>
  </div>
);

export default SubHeading;