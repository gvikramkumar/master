export interface UpdatePostInterface {
  updatePost: {
    id:string,
    SUB_MEASURE_KEY: number | null,
    SUB_MEASURE_NAME: string | null
    
  }
}

export interface DeletePostInterface {
  removePost: {
    id:string,
    SUB_MEASURE_NAME: string | null
  }
}

export interface SubmeasureInterface {
  submeasures: Array<{
    id: string, //test
    SUB_MEASURE_KEY: number | null,
    SUB_MEASURE_NAME: string | null
  }> | null;
}

export interface PostByIdInterface {
  submeasure:{
      id: string,
      SUB_MEASURE_KEY: number | null,
      SUB_MEASURE_NAME: string | null
  }
}