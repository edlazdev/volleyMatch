import { useForm } from 'react-hook-form';
import { UserPlus } from 'lucide-react';
import type { PlayerLevel } from '@/types';
import { LEVELS, LEVEL_SELECT_CLASS, levelCode } from '@/data/levels';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface PlayerFormValues {
  name: string;
  level: PlayerLevel;
}

interface PlayerFormProps {
  /** Indica si ya se alcanzó el cupo máximo de jugadores. */
  disabled?: boolean;
  onSubmit: (name: string, level: PlayerLevel) => void;
}

export function PlayerForm({ disabled, onSubmit }: PlayerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<PlayerFormValues>({
    defaultValues: { name: '', level: 3 },
  });

  const currentLevel = Number(watch('level')) as PlayerLevel;

  const submit = handleSubmit((values) => {
    onSubmit(values.name, Number(values.level) as PlayerLevel);
    reset({ name: '', level: values.level });
    setFocus('name');
  });

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            Nombre del jugador
          </label>
          <Input
            placeholder="Ej. Juan Pérez"
            autoComplete="off"
            invalid={!!errors.name}
            disabled={disabled}
            {...register('name', {
              required: 'El nombre es obligatorio',
              maxLength: { value: 40, message: 'Máximo 40 caracteres' },
            })}
          />
        </div>

        <div className="sm:w-44">
          <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            Nivel
          </label>
          <Select
            disabled={disabled}
            accentClass={LEVEL_SELECT_CLASS[currentLevel]}
            className="font-semibold"
            {...register('level', { required: true })}
          >
            {LEVELS.map((lvl) => (
              <option key={lvl.value} value={lvl.value} title={lvl.label}>
                {levelCode(lvl.value)} · {lvl.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {errors.name && (
        <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
          {errors.name.message}
        </p>
      )}

      <Button type="submit" disabled={disabled} fullWidth size="md">
        <UserPlus className="h-4 w-4" />
        {disabled ? 'Cupo completo' : 'Agregar jugador'}
      </Button>
    </form>
  );
}
