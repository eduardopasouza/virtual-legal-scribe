
export const getTypeColor = (type: string) => {
  switch (type) {
    case 'audiencia':
      return 'bg-blue-500';
    case 'prazo':
      return 'bg-red-500';
    case 'reuniao':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'audiencia':
      return 'Audiência';
    case 'prazo':
      return 'Prazo';
    case 'reuniao':
      return 'Reunião';
    default:
      return 'Outro';
  }
};

