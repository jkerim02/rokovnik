/**
 * imageResize — biranje i obrada naslovnica (§11).
 *
 * 1. expo-image-picker → korisnik bira iz galerije ili kamere
 * 2. expo-image-manipulator → resize na max ~480px
 * 3. expo-file-system → kopija u app document direktorij; vraća lokalnu putanju
 *
 * Vraća lokalni file path (čuva se u books.cover_local_path) ili null ako odustane.
 */
import { Directory, File, Paths } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const MAX_DIMENSION = 480;
const COVERS_DIR = 'covers';

async function processAndStore(uri: string): Promise<string> {
  // Resize: ograniči širinu na MAX_DIMENSION (visina proporcionalno).
  const context = ImageManipulator.manipulate(uri);
  context.resize({ width: MAX_DIMENSION });
  const ref = await context.renderAsync();
  const result = await ref.saveAsync({
    compress: 0.8,
    format: SaveFormat.JPEG,
  });

  // Osiguraj covers/ direktorij u app document folderu.
  const coversDir = new Directory(Paths.document, COVERS_DIR);
  if (!coversDir.exists) coversDir.create({ intermediates: true });

  // Premjesti obrađenu sliku pod stabilnim imenom.
  const dest = new File(coversDir, `cover_${Date.now()}.jpg`);
  const src = new File(result.uri);
  src.move(dest);
  return dest.uri;
}

/** Biraj iz galerije, obradi, vrati lokalnu putanju (ili null). */
export async function pickCoverFromLibrary(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
  });
  if (result.canceled || !result.assets[0]) return null;
  return processAndStore(result.assets[0].uri);
}

/** Slikaj kamerom, obradi, vrati lokalnu putanju (ili null). */
export async function pickCoverFromCamera(): Promise<string | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) return null;

  const result = await ImagePicker.launchCameraAsync({ quality: 1 });
  if (result.canceled || !result.assets[0]) return null;
  return processAndStore(result.assets[0].uri);
}

/** Obriši lokalnu naslovnicu sa diska (best-effort). */
export async function deleteCover(path: string | null | undefined): Promise<void> {
  if (!path) return;
  try {
    const file = new File(path);
    if (file.exists) file.delete();
  } catch {
    // best-effort; ignoriši
  }
}
