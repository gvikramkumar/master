

class MetaData {
  userId: string;
  directory: string;
}

export class FsFile {
  id: string;
  length: number;
  uploadDate: string;
  filename: string;
  contentType: string;
  metadata: MetaData;
}

