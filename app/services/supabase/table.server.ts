import supabase from './client.server';

export interface IHistory {
  id?: number;
  created_at?: Date;
  user_id: string;
  media_type: string;
  duration: number;
  watched?: number;
  route: string;
  media_id: string;
  season?: string;
  episode?: string;
  poster?: string;
  title?: string;
  overview?: string;
}

export interface Database {
  public: {
    Tables: {
      histories: {
        Row: IHistory;
        Insert: IHistory;
      };
    };
  };
}

export async function insertHistory(_history: IHistory) {
  try {
    const { data: oldData } = await supabase
      .from('histories')
      .select()
      .eq('user_id', _history.user_id)
      .eq('media_id', _history.media_id)
      .eq('media_type', _history.media_type);

    if (oldData && oldData.length > 0) {
      const { error } = await supabase
        .from('histories')
        .update({ ..._history })
        .eq('id', oldData[0].id);

      if (!error) return { data: oldData, error };

      //
    } else {
      const { data, error } = await supabase.from('histories').insert(_history).select();

      if (data) {
        // console.log(data);
        return { data: data as IHistory[], error };
      }

      if (error) {
        console.log(error);
      }
    }

    return { data: null, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error };
  }
}

export async function getHistory(_userId: string, _page = 0) {
  try {
    const { data, error } = await supabase
      .from('histories')
      .select()
      .eq('user_id', _userId)
      .order('updated_at')
      .range(_page * 20, (_page + 1) * 20);

    if (data) {
      // console.log(data);
      return data as IHistory[];
    }

    console.error(error);
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
