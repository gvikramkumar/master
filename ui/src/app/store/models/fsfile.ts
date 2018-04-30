

class MetaData {
  userName: string;
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

