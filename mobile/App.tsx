import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StatusBar, ScrollView, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import axios from 'axios';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.16.37.148:8000';
const supabaseUrl = 'https://mevuclijgmvpulzagjlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldnVjbGlqZ212cHVsemFnamxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjI3MDYsImV4cCI6MjA4NDEzODcwNn0.CTyGagsspgvUTcrcY6SLEJY6ilG0pilbh1tq9DqUheo';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigation.replace('DashboardFlow');
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter email and password.');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      if (data.session) navigation.replace('DashboardFlow');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Enter your email and password to sign in</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="m@example.com" placeholderTextColor="#94a3b8" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity><Text style={styles.forgotPassword}>Forgot password?</Text></TouchableOpacity>
              </View>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#94a3b8" value={password} onChangeText={setPassword} secureTextEntry />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <View style={styles.buttonContent}><Feather name="lock" size={16} color="#fff" style={{ marginRight: 8 }} /><Text style={styles.buttonText}>Sign In</Text></View>}
            </TouchableOpacity>

            <View style={styles.delimiterContainer}>
              <View style={styles.line} /><Text style={styles.delimiterText}>Or</Text><View style={styles.line} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={styles.signUpText}>Sign up</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter all fields.');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) throw error;
      Alert.alert('Success', 'Account created! Logging in...');
      navigation.replace('DashboardFlow');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
            <Feather name="arrow-left" size={24} color="#333" />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
          <View style={styles.card}>
            <Text style={styles.title}>Create an account</Text>
            <View style={styles.inputContainer}><Text style={styles.label}>Email</Text><TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" /></View>
            <View style={styles.inputContainer}><Text style={styles.label}>Password</Text><TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry /></View>
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}</TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// === Dashboard Screens ===

function OverviewScreen() {
  const [stats, setStats] = useState({ totalNotes: 0, studyHours: 0, targetCgpa: 0, cgpa: 0 });
  const [recentNotes, setRecentNotes] = useState([]);
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Mocking parallel API requests to mirror website logic
        const userRes = await axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${session.access_token}` } });
        const notesRes = await axios.get(`${API_URL}/auth/me/uploads`, { headers: { Authorization: `Bearer ${session.access_token}` } });
        const circRes = await axios.get(`${API_URL}/circulars`, { headers: { Authorization: `Bearer ${session.access_token}` } });

        setStats({
          totalNotes: notesRes.data?.length || 0,
          studyHours: userRes.data?.study_hours || 0,
          targetCgpa: userRes.data?.target_cgpa || 8.5,
          cgpa: userRes.data?.cgpa || 0,
        });
        setRecentNotes(notesRes.data?.slice(0, 5) || []);
        setCirculars(circRes.data?.slice(0, 3) || []);
      } catch (err) {
        console.log("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#0f172a" /></View>;

  return (
    <ScrollView style={styles.dashContainer} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.sectionTitle}>Dashboard Overview</Text>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Total Notes</Text>
            <Feather name="book-open" size={16} color="#64748b" />
          </View>
          <Text style={styles.statValue}>{stats.totalNotes}</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Study Hours</Text>
            <Feather name="clock" size={16} color="#64748b" />
          </View>
          <Text style={styles.statValue}>{stats.studyHours}h</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Premium Access</Text>
            <Feather name="star" size={16} color="#64748b" />
          </View>
          <Text style={[styles.statValue, { color: '#f59e0b', fontSize: 18 }]}>Basic</Text>
          <Text style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>Upgrade to unlock</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Exam Score</Text>
            <Feather name="trending-up" size={16} color="#64748b" />
          </View>
          <Text style={styles.statValue}>{stats.cgpa}</Text>
          <Text style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>Target: {stats.targetCgpa}</Text>
        </View>
      </View>

      {/* Activity Panels */}
      <View style={styles.panelsContainer}>
        <View style={styles.panelCard}>
          <View style={styles.panelHeader}>
            <Feather name="file-text" size={18} color="#0f172a" />
            <Text style={styles.panelTitle}>Recent Notes</Text>
          </View>
          <View style={styles.panelDivider} />
          {recentNotes.length > 0 ? recentNotes.map((n: any) => (
            <View key={n.id} style={styles.feedItem}>
              <Text style={styles.feedTitle} numberOfLines={1}>{n.title}</Text>
              <Text style={styles.feedSub}>{n.subject}</Text>
            </View>
          )) : <Text style={styles.emptyText}>No recent notes found.</Text>}
        </View>

        <View style={styles.panelCard}>
          <View style={styles.panelHeader}>
            <Feather name="bell" size={18} color="#0f172a" />
            <Text style={styles.panelTitle}>Circulars & Updates</Text>
          </View>
          <View style={styles.panelDivider} />
          {circulars.length > 0 ? circulars.map((c: any) => (
            <View key={c.id} style={styles.feedItem}>
              <Text style={styles.feedTitle} numberOfLines={2}>{c.title}</Text>
              <Text style={styles.feedSub}>{new Date(c.date).toLocaleDateString()}</Text>
            </View>
          )) : <Text style={styles.emptyText}>No recent announcements.</Text>}
        </View>
      </View>
    </ScrollView>
  );
}

function PlaceholderScreen({ route }: any) {
  return (
    <View style={styles.centered}>
      <Feather name="tool" size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#334155' }}>{route.name} Module</Text>
      <Text style={{ color: '#94a3b8', marginTop: 8 }}>Coming Soon</Text>
    </View>
  );
}

// === Custom Drawer Setup ===

function CustomDrawerContent(props: any) {
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${session.access_token}` } });
        setUser(res.data);
      } catch (e) { }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    props.navigation.replace('Login');
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.drawerBrand}>
        <View style={styles.brandIcon}><Text style={{ color: '#fff', fontWeight: 'bold' }}>EB</Text></View>
        <Text style={styles.brandText}>ExamBuddy</Text>
      </View>

      <View style={styles.drawerProfile}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.profileName}>{user.full_name || 'Student User'}</Text>
          <Text style={styles.profileMeta}>Sem: {user.semester || 'N/A'} • SGPA: {user.sgpa || 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.drawerDivider} />

      <View style={{ flex: 1, paddingTop: 10 }}>
        <DrawerItemList {...props} />
      </View>

      <View style={{ paddingBottom: 20, paddingTop: 10, borderTopWidth: 1, borderColor: '#e2e8f0' }}>
        <DrawerItem
          label="Sign Out"
          icon={({ size }) => <Feather name="log-out" size={size} color="#ef4444" />}
          labelStyle={{ color: '#ef4444', fontWeight: '500', marginLeft: -16 }}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

function DashboardDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
        headerTintColor: '#0f172a',
        headerTitleStyle: { fontWeight: '600' },
        drawerActiveBackgroundColor: '#f1f5f9',
        drawerActiveTintColor: '#0f172a',
        drawerInactiveTintColor: '#64748b',
        drawerLabelStyle: { marginLeft: -16, fontWeight: '500' }
      }}
    >
      <Drawer.Screen name="Overview" component={OverviewScreen} options={{ drawerIcon: ({ color, size }) => <Feather name="layout" size={size} color={color} /> }} />
      <Drawer.Screen name="Notes Library" component={PlaceholderScreen} options={{ drawerIcon: ({ color, size }) => <Feather name="database" size={size} color={color} /> }} />
      <Drawer.Screen name="Sessional Papers" component={PlaceholderScreen} options={{ drawerIcon: ({ color, size }) => <Feather name="file-text" size={size} color={color} /> }} />
      <Drawer.Screen name="University Papers" component={PlaceholderScreen} options={{ drawerIcon: ({ color, size }) => <Feather name="award" size={size} color={color} /> }} />
      <Drawer.Screen name="Leaderboard" component={PlaceholderScreen} options={{ drawerIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} /> }} />
      <Drawer.Screen name="Subscription" component={PlaceholderScreen} options={{ drawerIcon: ({ color, size }) => <Feather name="credit-card" size={size} color={color} /> }} />
      <Drawer.Screen name="Settings" component={PlaceholderScreen} options={{ drawerIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} /> }} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="DashboardFlow" component={DashboardDrawer} options={{ headerShown: false, animation: 'fade' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  inputContainer: { marginBottom: 16 },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 14, fontWeight: '500', color: '#0f172a', marginBottom: 6 },
  forgotPassword: { fontSize: 14, color: '#64748b', textDecorationLine: 'underline' },
  input: { backgroundColor: '#fff', height: 44, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#cbd5e1', fontSize: 14, color: '#0f172a' },
  button: { backgroundColor: '#0f172a', height: 44, borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#f8fafc', fontSize: 14, fontWeight: '600' },
  delimiterContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  delimiterText: { marginHorizontal: 10, fontSize: 12, color: '#64748b', textTransform: 'uppercase' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4, paddingTop: 16 },
  footerText: { fontSize: 14, color: '#64748b' },
  signUpText: { fontSize: 14, fontWeight: '600', color: '#0f172a', textDecorationLine: 'underline' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  backButtonText: { fontSize: 14, color: '#333', marginLeft: 6, fontWeight: '500' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },

  // Custom Drawer Styles
  drawerBrand: { padding: 20, paddingTop: 40, flexDirection: 'row', alignItems: 'center' },
  brandIcon: { width: 32, height: 32, backgroundColor: '#0f172a', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  brandText: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  drawerProfile: { padding: 20, paddingTop: 0, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#cbd5e1', marginRight: 12 },
  profileName: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  profileMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  drawerDivider: { height: 1, backgroundColor: '#e2e8f0', marginHorizontal: 16 },

  // Dashboard Overview Styles
  dashContainer: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  panelsContainer: { marginTop: 8 },
  panelCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16, overflow: 'hidden' },
  panelHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#f8fafc' },
  panelTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginLeft: 8 },
  panelDivider: { height: 1, backgroundColor: '#e2e8f0' },
  feedItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  feedTitle: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 4 },
  feedSub: { fontSize: 12, color: '#94a3b8' },
  emptyText: { padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 14 }
});
