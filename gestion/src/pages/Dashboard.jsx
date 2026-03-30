import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { FolderOpen, Plus, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/dateUtils';

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const stats = [
    { label: 'Projets', value: projects.length, icon: FolderOpen, color: 'primary' },
    { label: 'Notes totales', value: projects.reduce((sum, p) => sum + (p.notesCount || 0), 0), icon: TrendingUp, color: 'secondary' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Bienvenue, {user?.email || user?.phone}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Voici un résumé de vos projets et activités récentes
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="hover:shadow-xl">
                <CardBody className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Projets récents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Projets récents
          </h2>
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              Voir tous
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardBody className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">Aucun projet encore</p>
              <Link to="/projects">
                <Button className="mt-4">
                  <Plus className="w-4 h-4" />
                  Créer un projet
                </Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/projects/${project.id}`}>
                  <Card className="hover:shadow-xl cursor-pointer h-full group">
                    <CardBody className="flex flex-col h-full">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-2 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                        {project.description || 'Sans description'}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(project.created_at)}
                        </span>
                        <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full font-medium">
                          {project.notesCount || 0} notes
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
