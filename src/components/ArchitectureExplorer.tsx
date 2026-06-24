import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, CheckCircle, Terminal, RefreshCw, Cpu, Database } from 'lucide-react';

interface FileNodeProps {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNodeProps[];
  content?: string;
}

export default function ArchitectureExplorer() {
  const [selectedFile, setSelectedFile] = useState<FileNodeProps | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'root': true,
    'root/next-app': true,
    'root/next-app/src': true,
    'root/next-app/src/app': true,
    'root/nestjs-microservices': true,
    'root/nestjs-microservices/src': true,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const fhirPayload = `{
  "resourceType": "Patient",
  "id": "medica-yaounde-90812",
  "active": true,
  "name": [
    {
      "use": "official",
      "family": "Nguene",
      "given": ["Jean-Pierre"]
    }
  ],
  "telecom": [
    { "system": "phone", "value": "+237 677 88 99 00", "use": "mobile" },
    { "system": "email", "value": "jp.nguene@domain.cm" }
  ],
  "gender": "male",
  "birthDate": "1984-11-12",
  "address": [
    {
      "use": "home",
      "line": ["Quartier Bastos, Rue 1.024"],
      "city": "Yaoundé",
      "country": "CM"
    }
  ],
  "managingOrganization": {
    "reference": "Organization/medica-plus-yaounde",
    "display": "MEDICA+ Virtual Hospital"
  }
}`;

  const nestjsGateway = `import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/ws-jwt.guard';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'teleconsultation',
})
export class TeleconsultationGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; userId: string }
  ) {
    client.join(payload.roomId);
    client.to(payload.roomId).emit('userJoined', { userId: payload.userId });
    return { status: 'joined', roomId: payload.roomId };
  }

  @SubscribeMessage('signal')
  handleSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; signal: any; to: string }
  ) {
    client.to(payload.roomId).emit('signalReceived', {
      from: client.id,
      signal: payload.signal,
    });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; message: string; sender: string }
  ) {
    this.server.to(payload.roomId).emit('message', {
      sender: payload.sender,
      text: payload.message,
      timestamp: new Date().toISOString(),
    });
  }
}`;

  const authService = `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  private readonly aesKey = crypto.scryptSync(process.env.ENCRYPTION_SECRET, 'salt', 32);

  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisService
  ) {}

  // Chiffrement AES-256-GCM des données sensibles du DMP patient
  encryptMedicalData(plainText: string): { ciphertext: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.aesKey, iv);
    let ciphertext = cipher.update(plainText, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return {
      ciphertext,
      iv: iv.toString('hex'),
      tag,
    };
  }

  // Génération de Token JWT + MFA Vérification
  async generateSessionToken(user: any, mfaVerified = false) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role, 
      mfaVerified 
    };
    
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    // Mise en cache Redis pour réévaluation rapide
    await this.redis.set(\`session:\${user.id}\`, token, 3600);
    return { token, mfaRequired: !mfaVerified && user.isMfaEnabled };
  }
}`;

  const schemaSql = `-- Schéma de base de données PostgreSQL pour MEDICA+
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  mfa_secret VARCHAR(100),
  is_mfa_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL,
  fhir_payload JSONB NOT NULL, -- Stockage natif FHIR JSONb indexé
  encrypted_notes TEXT NOT NULL, -- Chiffrement AES-256
  encryption_iv VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  doctor_name VARCHAR(150) NOT NULL,
  prescription_date DATE DEFAULT CURRENT_DATE,
  items JSONB NOT NULL, -- Array de médicaments prescrits
  digital_signature TEXT NOT NULL, -- Signé par clé privée du médecin
  fhir_compliant BOOLEAN DEFAULT TRUE
);

-- Index pour requêtes FHIR ultra-rapides
CREATE INDEX idx_medical_records_fhir ON medical_records USING gin (fhir_payload);
`;

  const layoutTsx = `import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MEDICA+ | Hôpital Virtuel Premium Yaoundé',
  description: 'Télémédecine, Dossier Médical Partagé FHIR et soins premium au Cameroun.',
  manifest: '/manifest.json', // Configuration Progressive Web App (PWA)
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MEDICA+',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={\`\${outfit.variable} \${inter.variable}\`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}`;

  const files: FileNodeProps[] = [
    {
      name: 'MEDICA+ Codebase',
      path: 'root',
      type: 'folder',
      children: [
        {
          name: 'next-app (Frontend Client PWA)',
          path: 'root/next-app',
          type: 'folder',
          children: [
            {
              name: 'src',
              path: 'root/next-app/src',
              type: 'folder',
              children: [
                {
                  name: 'app',
                  path: 'root/next-app/src/app',
                  type: 'folder',
                  children: [
                    {
                      name: 'layout.tsx',
                      path: 'root/next-app/src/app/layout.tsx',
                      type: 'file',
                      content: layoutTsx,
                    },
                    {
                      name: 'page.tsx',
                      path: 'root/next-app/src/app/page.tsx',
                      type: 'file',
                      content: '// Code de la Page d\'Accueil MEDICA+ avec grilles asymétriques, filtres et sections premium.',
                    },
                    {
                      name: 'api',
                      path: 'root/next-app/src/app/api',
                      type: 'folder',
                      children: [
                        {
                          name: 'fhir',
                          path: 'root/next-app/src/app/api/fhir',
                          type: 'folder',
                          children: [
                            {
                              name: 'patient-record.json',
                              path: 'root/next-app/src/app/api/fhir/patient-record.json',
                              type: 'file',
                              content: fhirPayload,
                            }
                          ]
                        }
                      ]
                    }
                  ],
                },
                {
                  name: 'manifest.json',
                  path: 'root/next-app/src/manifest.json',
                  type: 'file',
                  content: `{
  "name": "MEDICA+ Hôpital Virtuel",
  "short_name": "MEDICA+",
  "description": "Plateforme médicale de référence africaine à Yaoundé",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0d9488",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}`,
                }
              ]
            }
          ]
        },
        {
          name: 'nestjs-microservices (Backend API)',
          path: 'root/nestjs-microservices',
          type: 'folder',
          children: [
            {
              name: 'src',
              path: 'root/nestjs-microservices/src',
              type: 'folder',
              children: [
                {
                  name: 'auth',
                  path: 'root/nestjs-microservices/src/auth',
                  type: 'folder',
                  children: [
                    {
                      name: 'auth.service.ts',
                      path: 'root/nestjs-microservices/src/auth/auth.service.ts',
                      type: 'file',
                      content: authService,
                    }
                  ]
                },
                {
                  name: 'telecom',
                  path: 'root/nestjs-microservices/src/telecom',
                  type: 'folder',
                  children: [
                    {
                      name: 'teleconsultation.gateway.ts',
                      path: 'root/nestjs-microservices/src/telecom/teleconsultation.gateway.ts',
                      type: 'file',
                      content: nestjsGateway,
                    }
                  ]
                },
                {
                  name: 'database',
                  path: 'root/nestjs-microservices/src/database',
                  type: 'folder',
                  children: [
                    {
                      name: 'schema.sql',
                      path: 'root/nestjs-microservices/src/database/schema.sql',
                      type: 'file',
                      content: schemaSql,
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  // Set default file to layout.tsx when component mounts
  React.useEffect(() => {
    // Traverse to locate layout.tsx or similar file
    setSelectedFile({
      name: 'auth.service.ts',
      path: 'root/nestjs-microservices/src/auth/auth.service.ts',
      type: 'file',
      content: authService,
    });
  }, []);

  const renderTree = (nodes: FileNodeProps[]) => {
    return nodes.map((node) => {
      const isExpanded = expandedFolders[node.path];
      const hasChildren = node.children && node.children.length > 0;
      const isSelected = selectedFile?.path === node.path;

      return (
        <div key={node.path} className="select-none pl-3 text-sm">
          <div
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(node.path);
              } else {
                setSelectedFile(node);
              }
            }}
            className={`flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer transition-colors ${
              isSelected ? 'bg-teal-50 text-teal-800 font-medium' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            {node.type === 'folder' ? (
              <>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                <Folder className="w-4 h-4 text-teal-600 shrink-0 fill-teal-100" />
              </>
            ) : (
              <>
                <span className="w-4 h-4 shrink-0" />
                <File className="w-4 h-4 text-slate-400 shrink-0" />
              </>
            )}
            <span className="truncate">{node.name}</span>
          </div>

          {hasChildren && isExpanded && (
            <div className="border-l border-slate-200 ml-3 pl-1 my-1">
              {renderTree(node.children!)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div id="architecture-explorer" className="liquid-glass rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-teal-500/10 p-2 rounded-lg text-teal-400 border border-teal-500/20">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-semibold font-display tracking-wide">MEDICA+ Architecture Technique</h3>
            <p className="text-xs text-slate-400">Next.js App Router (PWA) & Microservices NestJS (HL7 / FHIR)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            STANDARDS FHIR/HL7 OK
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Navigation panel */}
        <div className="lg:col-span-4 border-r border-white/20 bg-white/25 p-4 overflow-y-auto max-h-[500px]">
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Arborescence Projet</span>
            <Database className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="space-y-1">
            {renderTree(files)}
          </div>
        </div>

        {/* Code viewer */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 text-slate-300">
          {selectedFile ? (
            <>
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <span className="text-emerald-500 font-bold font-sans">Active:</span>
                  <span className="truncate font-mono">{selectedFile.path}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="p-4 overflow-auto font-mono text-xs leading-relaxed max-h-[440px] flex-1">
                <pre className="text-emerald-400/90 whitespace-pre">
                  {selectedFile.content}
                </pre>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 text-slate-500 flex-1">
              <Terminal className="w-12 h-12 text-slate-700 mb-3 animate-bounce" />
              <p className="text-sm">Sélectionnez un fichier pour inspecter l'implémentation de la stack technique MEDICA+</p>
              <p className="text-xs text-slate-600 mt-1 font-mono">Chiffrement AES-256-GCM, standard FHIR JSON, Gateway WebSockets</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
