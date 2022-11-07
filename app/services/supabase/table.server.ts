import supabase from './client.server';

export interface IHistoryDTO {
  user_id: string;
  media_type: 'movie' | 'tv' | 'anime';
  duration: number; // in seconds
  watched: number;
  route: string;
  media_id: string;
  season?: string;
  episode?: string;
  poster?: string;
  title?: string;
  overview?: string;
}

export interface IHistory extends IHistoryDTO {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Database {
  public: {
    Tables: {
      histories: {
        Row: IHistory;
        Insert: IHistoryDTO;
      };
    };
  };
}

export async function insertHistory(_history: IHistoryDTO) {
  try {
    const query = supabase
      .from('histories')
      .select()
      .eq('user_id', _history.user_id)
      .eq('media_id', _history.media_id)
      .eq('media_type', _history.media_type);

    if (_history.season) {
      query.eq('season', _history.season);
    }

    if (_history.episode) {
      query.eq('episode', _history.episode);
    }

    const { data: oldData } = await query;

    if (oldData && oldData.length > 0) {
      const { error } = await supabase
        .from('histories')
        .update({ ..._history })
        .eq('id', oldData[0].id);

      if (!error) return { data: oldData as IHistory[], error };

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

export async function getHistory(
  _userId: string,
  types: string | null,
  from: string | null,
  to: string | null,
  _page = 1,
) {
  try {
    const query = supabase.from('histories').select().eq('user_id', _userId);

    if (types) {
      query.in('media_type', types.split(','));
    }
    if (from) {
      query.gte('updated_at', new Date(from).toISOString());
    }
    if (to) {
      const date = new Date(to);
      date.setDate(date.getDate() + 1);
      query.lte('updated_at', date.toISOString());
    }

    query.order('updated_at', { ascending: false }).range((_page - 1) * 20, _page * 20 - 1);

    const { data, error } = await query;

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

export async function getCountHistory(
  _userId: string,
  types: string | null,
  from: string | null,
  to: string | null,
) {
  try {
    const query = supabase
      .from('histories')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', _userId);

    if (types) {
      query.in('media_type', types.split(','));
    }
    if (from) {
      query.gte('updated_at', new Date(from).toISOString());
    }
    if (to) {
      const date = new Date(to);
      date.setDate(date.getDate() + 1);
      query.lte('updated_at', date.toISOString());
    }
    const { count, error } = await query;

    if (count) {
      return count;
    }
    console.error(error);
    return 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
