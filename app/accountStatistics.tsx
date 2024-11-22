// accountStatistics.tsx
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/authContext';
import { getFollowers } from '@/handlers/followHandler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getProfile } from '@/handlers/profileHandler';

interface Follower {
  username: string;
  created_at: string; // Fecha de cuando empezó a seguir
}

interface TrendItem {
  date: string;
  count: number;
}

export default function AccountStatistics() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followersTrend, setFollowersTrend] = useState<TrendItem[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(
    moment().subtract(30, 'days').toDate()
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState<boolean>(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] =
    useState<boolean>(false);

  // Interval ID para poder limpiarlo en cleanup
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchData();

    // Configurar el intervalo para actualizar los datos cada 30 segundos
    intervalRef.current = setInterval(() => {
      fetchData();
    }, 30000); // 30000 ms = 30 segundos

    // Cleanup al desmontar el componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startDate, endDate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Obtener el perfil del usuario
      const profileResponse = await getProfile();
      if (profileResponse.success) {
        const username = profileResponse.profile.username;

        // Obtener la lista de seguidores
        const followersResponse = await getFollowers(username);
        if (followersResponse.success && followersResponse.followers) {
          const followers: Follower[] = followersResponse.followers;

          // Calcular el número actual de seguidores
          setFollowersCount(followers.length);

          // Filtrar seguidores por el rango de fechas seleccionado
          const filteredFollowers = followers.filter((follower) => {
            const followerDate = moment(follower.created_at);
            return followerDate.isBetween(startDate, endDate, undefined, '[]');
          });

          // Calcular la tendencia de seguidores
          const trend: TrendItem[] = [];

          // Crear un mapa para contar seguidores por día
          const countsByDate: { [date: string]: number } = {};

          filteredFollowers.forEach((follower) => {
            const date = moment(follower.created_at).format('DD/MM/YYYY');
            countsByDate[date] = (countsByDate[date] || 0) + 1;
          });

          // Ordenar las fechas
          const sortedDates = Object.keys(countsByDate).sort((a, b) => {
            return moment(a, 'DD/MM/YYYY').diff(moment(b, 'DD/MM/YYYY'));
          });

          sortedDates.forEach((date) => {
            trend.push({ date, count: countsByDate[date] });
          });

          setFollowersTrend(trend);
        } else {
          setFollowersCount(0);
          setFollowersTrend([]);
        }
      } else {
        Alert.alert('Error', 'No se pudo obtener el perfil del usuario.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Ocurrió un error al obtener los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleConfirmStartDate = (date: Date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleConfirmEndDate = (date: Date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

  // Función para manejar el botón de volver
  const handleBackPress = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado con botón de volver */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#1DA1F2" />
        </TouchableOpacity>
        <Text style={styles.title}>Estadísticas de Cuenta</Text>
      </View>

      {/* Filtros de fecha */}
      <View style={styles.customDatePickerContainer}>
        <TouchableOpacity
          onPress={showStartDatePicker}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {startDate
              ? moment(startDate).format('DD/MM/YYYY')
              : 'Fecha Inicio'}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmStartDate}
          onCancel={hideStartDatePicker}
        />

        <TouchableOpacity
          onPress={showEndDatePicker}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {endDate ? moment(endDate).format('DD/MM/YYYY') : 'Fecha Fin'}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmEndDate}
          onCancel={hideEndDatePicker}
        />
      </View>

      {/* Panel de estadísticas */}
      <View style={styles.statisticsPanel}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{followersCount}</Text>
          <Text style={styles.statLabel}>Seguidores Actuales</Text>
        </View>
      </View>

      {/* Tendencia de seguidores */}
      <Text style={styles.subtitle}>Tendencia de Seguidores</Text>
      {followersTrend.length > 0 ? (
        <FlatList
          data={followersTrend}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View style={styles.trendItem}>
              <Text style={styles.trendDate}>{item.date}</Text>
              <Text style={styles.trendCount}>{item.count} seguidores</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>
          No hay datos de tendencia para el período seleccionado.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Fondo oscuro
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black', // Fondo oscuro
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginTop: 50,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF', // Texto claro
    marginLeft: 50,
  },
  customDatePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#1E1E1E', // Botón oscuro
    marginHorizontal: 10,
    borderRadius: 5,
  },
  datePickerText: {
    fontSize: 14,
    color: '#FFFFFF', // Texto claro
  },
  statisticsPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    width: '45%',
    backgroundColor: '#1E1E1E', // Fondo oscuro
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1DA1F2', // Color de acento
  },
  statLabel: {
    fontSize: 14,
    color: '#B0B0B0', // Texto gris claro
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 5,
    color: '#FFFFFF', // Texto claro
  },
  trendItem: {
    backgroundColor: '#1E1E1E', // Fondo oscuro
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendDate: {
    fontSize: 16,
    color: '#FFFFFF', // Texto claro
  },
  trendCount: {
    fontSize: 16,
    color: '#FFFFFF', // Texto claro
  },
  noDataText: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 20,
  },
});
