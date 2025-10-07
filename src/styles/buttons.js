import { StyleSheet } from 'react-native';

export const buttonStyles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonFlex: {
    flex: 1,
  },
  buttonText: {
    color: '#111',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  buttonLeft: {
    marginRight: 8,
  },
  buttonRight: {
    marginLeft: 8,
  },
});

export default buttonStyles;

