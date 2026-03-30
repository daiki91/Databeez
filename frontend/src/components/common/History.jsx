import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDateTime } from '../../utils/dateUtils';
import { Badge } from './Badge';
import { LoadingSpinner } from './LoadingSpinner';
import { History as HistoryIcon, Edit2, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const actionIcons = {
  CREATE: { icon: Plus, color: 'success' },
  UPDATE: { icon: Edit2, color: 'primary' },
  DELETE: { icon: Trash2, color: 'danger' }
};

const actionLabels = {
  CREATE: 'Créé',
  UPDATE: 'Modifié',
  DELETE: 'Supprimé'
};

const colorClasses = {
  success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
};

const textColorClasses = {
  success: 'text-green-600 dark:text-green-400',
  primary: 'text-blue-600 dark:text-blue-400',
  danger: 'text-red-600 dark:text-red-400'
};

const parseJsonField = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return null;
};

const formatValue = (value, max = 50) => {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') {
    return value.length > max ? `"${value.substring(0, max)}..."` : `"${value}"`;
  }
  if (typeof value === 'object') {
    const json = JSON.stringify(value);
    return json.length > max ? `${json.substring(0, max)}...` : json;
  }
  return String(value);
};

export const History = ({ entityType, entityId, title = "Historique" }) => {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: [`history-${entityType}`, entityId],
    queryFn: async () => {
      if (entityType === 'project') {
        const response = await api.get(`/projects/${entityId}/history`);
        return response.data;
      } else if (entityType === 'note') {
        const response = await api.get(`/notes/${entityId}/history`);
        return response.data;
      }
      return [];
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <HistoryIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <p className="text-slate-600 dark:text-slate-400">Aucun historique</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <HistoryIcon className="w-5 h-5" />
        {title}
      </h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs.map((log, index) => {
          const actionConfig = actionIcons[log.action] || actionIcons.UPDATE;
          const ActionIcon = actionConfig.icon;
          const actionLabel = actionLabels[log.action];
          const userDisplay = log.user_email || log.user_phone || 'Utilisateur supprimé';
          const colorClass = colorClasses[actionConfig.color];
          const textColorClass = textColorClasses[actionConfig.color];
          const oldValues = parseJsonField(log.old_values) || {};
          const newValues = parseJsonField(log.new_values) || {};

          return (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
            >
              <div className={`mt-1 p-2 rounded-lg ${colorClass}`}>
                <ActionIcon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {actionLabel}
                  </span>
                  <Badge variant={actionConfig.color} size="sm">
                    par {userDisplay}
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formatDateTime(log.action_date)}
                </p>

                {/* Afficher les modifications */}
                {(log.action === 'UPDATE' || log.action === 'DELETE') && log.old_values && (
                  <div className="mt-2 text-xs space-y-1">
                    {Object.entries(oldValues).map(([key, oldVal]) => {
                      const newVal = newValues[key];
                      if (log.action === 'DELETE' || (oldVal !== newVal)) {
                        return (
                          <div key={key} className="text-slate-600 dark:text-slate-400">
                            <span className="font-medium">{key}:</span>{' '}
                            {log.action === 'DELETE' ? (
                              <span className="line-through text-red-600 dark:text-red-400">
                                {formatValue(oldVal, 50)}
                              </span>
                            ) : (
                              <>
                                <span className="line-through text-red-600 dark:text-red-400">
                                  {formatValue(oldVal, 30)}
                                </span>
                                {' → '}
                                <span className="text-green-600 dark:text-green-400">
                                  {formatValue(newVal, 30)}
                                </span>
                              </>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}

                {log.action === 'CREATE' && log.new_values && (
                  <div className="mt-2 text-xs space-y-1 text-green-600 dark:text-green-400">
                    {Object.entries(newValues).map(([key, val]) => (
                      val && (
                        <div key={key}>
                          <span className="font-medium">{key}:</span> {formatValue(val, 50)}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
