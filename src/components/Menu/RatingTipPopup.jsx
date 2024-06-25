import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Typography } from '@mui/material';
import { Rating } from '@mui/material';
import { Close } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const RatingTipPopup = ({ open, onClose, userId, restaurantId, orderId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tip, setTip] = useState('');

  const handleTipChange = (event) => {
    setTip(event.target.value);
  };

  const handleFormSubmit = async () => {
    try {
      console.log('Submitting feedback with the following data:');
      console.log('User ID:', userId);
      console.log('Restaurant ID:', restaurantId);
      console.log('Order ID:', orderId);
      console.log('Comment:', comment);
      console.log('Rating:', rating);
      console.log('Tip:', tip);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/avis/resturant/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment,
          note: rating,
          restaurantFK: restaurantId,
          orderFK: orderId,
        }),
      });

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      }

      toast.success('Thanks for your feedback!', {
        style: {
          border: '1px solid #FA8072',
          padding: '16px',
          color: '#FA8072',
        },
        iconTheme: {
          primary: '#FA8072',
          secondary: '#D6C7D4',
        },
      });

      onClose();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.error(err.message, {
        style: {
          border: '1px solid #FA8072',
          padding: '16px',
          color: '#FA8072',
        },
        iconTheme: {
          primary: '#FA8072',
          secondary: '#D6C7D4',
        },
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Tell us about your experience
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">Rate your experience</Typography>
        <Rating
          name="simple-controlled"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Leave a comment"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Typography variant="h6">Leave a tip</Typography>
        <div>
          {['5$', '10$', '15$'].map((amount) => (
            <Button
              key={amount}
              variant={tip === amount ? 'contained' : 'outlined'}
              onClick={() => setTip(amount)}
              sx={{ margin: '0 5px' }}
            >
              {amount}
            </Button>
          ))}
          <TextField
            margin="dense"
            label="Other"
            type="number"
            value={tip}
            onChange={handleTipChange}
            sx={{ width: '80px', marginLeft: '5px' }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingTipPopup;
