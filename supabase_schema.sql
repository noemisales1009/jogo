-- Cria a tabela de perguntas
CREATE TABLE questions_jogo (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  villain_id text NOT NULL,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_index integer NOT NULL,
  explanation text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de pontuações
CREATE TABLE scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  player_name text NOT NULL,
  score integer NOT NULL,
  hero_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- View para o Ranking Global (Top Scores)
CREATE OR REPLACE VIEW leaderboard AS
SELECT player_name, MAX(score) as max_score
FROM scores
GROUP BY player_name
ORDER BY max_score DESC;

-- Ativa a política de segurança a nível de linha (RLS)
ALTER TABLE questions_jogo ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Permitir leitura anonima das perguntas" ON questions_jogo FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Permitir leitura de scores" ON scores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Permitir inserção auth" ON scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

/*
Exemplos de IDs de vilões usados no jogo:
- acineto (Acinetobacter panresistente)
- kpc (Klebsiella KPC)
- mrsa (Staphylococcus MRSA)
- vre (Enterococcus VRE)
- candida (Candida auris)
- cdiff (Clostridioides difficile)
*/
