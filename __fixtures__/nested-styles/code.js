const title = css({
  '&:hover': {
    color: `blue`,
  },

  section: {
    fontSize: 20,
  },

  [test]: {
    fontSize: '3em',
  },

  '@keyframes bounce': {
    '0%': { transform: 'scale(1.01)' },
    '100%': { transform: 'scale(0.99)' }
  }
});
