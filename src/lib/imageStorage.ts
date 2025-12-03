// Gerenciamento de imagens customizadas no localStorage

const STORAGE_KEY = "codechella_event_images";

interface CustomImages {
  [eventId: string]: string;
}

// Salvar URL de imagem customizada para um evento
export function saveCustomImage(eventId: number, imageUrl: string): void {
  try {
    const images = getCustomImages();
    images[eventId.toString()] = imageUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch (error) {
    // Error handled silently
  }
}

// Obter URL de imagem customizada para um evento
export function getCustomImage(eventId: number): string | null {
  try {
    const images = getCustomImages();
    return images[eventId.toString()] || null;
  } catch (error) {
    return null;
  }
}

// Obter todas as imagens customizadas
export function getCustomImages(): CustomImages {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
}

// Remover imagem customizada de um evento
export function removeCustomImage(eventId: number): void {
  try {
    const images = getCustomImages();
    delete images[eventId.toString()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch (error) {
    // Error handled silently
  }
}

// Limpar todas as imagens customizadas
export function clearCustomImages(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Error handled silently
  }
}
