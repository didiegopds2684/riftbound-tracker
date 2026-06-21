import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors, radius, spacing, typography } from '../lib/theme';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';

type Mode = 'login' | 'register' | 'forgot';

export function AuthScreen() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function reset() {
    setError(null);
    setMessage(null);
  }

  async function handleSubmit() {
    setLoading(true);
    reset();

    if (mode === 'login') {
      const err = await signIn(email, password);
      if (err) setError(err);
    } else if (mode === 'register') {
      if (!name.trim() || !nickname.trim()) {
        setError('Preencha nome e nickname.');
        setLoading(false);
        return;
      }
      const err = await signUp(email, password, name.trim(), nickname.trim());
      if (err) setError(err);
      else setMessage('Confirme seu email para ativar a conta!');
    } else {
      const err = await resetPassword(email);
      if (err) setError(err);
      else setMessage('Link de redefinição enviado para o seu email!');
    }

    setLoading(false);
  }

  const title = mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : 'Recuperar senha';

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>⚔</Text>
          <Text style={styles.appName}>Riftbound Tracker</Text>
          <Text style={styles.appSub}>Diário de partidas pessoal</Text>
        </View>

        <View style={styles.card}>
          <Text style={typography.h2}>{title}</Text>

          {mode === 'register' && (
            <>
              <FormField
                label="Nome"
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                autoCapitalize="words"
              />
              <FormField
                label="Nickname"
                value={nickname}
                onChangeText={setNickname}
                placeholder="nick único"
                autoCapitalize="none"
              />
            </>
          )}

          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="email@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {mode !== 'forgot' && (
            <FormField
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />
          )}

          {error && <Text style={styles.error}>{error}</Text>}
          {message && <Text style={styles.success}>{message}</Text>}

          <Button label={title} onPress={handleSubmit} loading={loading} />

          <View style={styles.links}>
            {mode === 'login' && (
              <>
                <Pressable onPress={() => { setMode('register'); reset(); }}>
                  <Text style={styles.link}>Criar conta</Text>
                </Pressable>
                <Pressable onPress={() => { setMode('forgot'); reset(); }}>
                  <Text style={styles.link}>Esqueci a senha</Text>
                </Pressable>
              </>
            )}
            {mode !== 'login' && (
              <Pressable onPress={() => { setMode('login'); reset(); }}>
                <Text style={styles.link}>← Voltar ao login</Text>
              </Pressable>
            )}
          </View>
        </View>

        <Text style={styles.disclaimer}>
          App não-oficial • Não afiliado à Riot Games{'\n'}
          Dados de cartas via Riftcodex (fan project)
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.xxl },
  logo: { fontSize: 56 },
  appName: { ...typography.h1, marginTop: spacing.sm, color: colors.primary },
  appSub: { ...typography.bodySmall, marginTop: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  error: { color: colors.danger, fontSize: 13, textAlign: 'center' },
  success: { color: colors.success, fontSize: 13, textAlign: 'center' },
  links: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm },
  link: { color: colors.primary, fontSize: 14 },
  disclaimer: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 16,
  },
});
