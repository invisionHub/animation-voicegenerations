import React, { useState, useRef } from 'react';
import { Asset, Scene, SceneAsset } from '../../types';
import {
  Upload,
  Search,
  Grid as GridIcon,
  List as ListIcon,
  Trash2,
  Check,
  Film,
  FileImage,
  Layers,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Dialog } from '../ui/Dialog';
import { useToast } from '../ui/NotificationToast';

interface AssetLibraryProps {
  assets: Asset[];
  scenes: Scene[];
  sceneAssets: SceneAsset[];
  onUploadAssets: (newAssets: Asset[]) => void;
  onDeleteAsset: (assetId: string) => void;
  onAssignAssetToScene: (assetId: string, sceneId: string) => void;
  onUnassignAssetFromScene: (assetId: string, sceneId: string) => void;
}

export const AssetLibrary: React.FC<AssetLibraryProps> = ({
  assets,
  scenes,
  sceneAssets,
  onUploadAssets,
  onDeleteAsset,
  onAssignAssetToScene,
  onUnassignAssetFromScene,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAssetForAssign, setSelectedAssetForAssign] = useState<Asset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((f) =>
      ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(f.type)
    );

    if (validFiles.length === 0) {
      toast.error('Unsupported file format', 'Please upload PNG, JPEG, SVG, or WebP images.');
      return;
    }

    let currentIdNum = assets.length;
    const newAssetPromises = validFiles.map((file) => {
      currentIdNum += 1;
      const assetId = `A${currentIdNum.toString().padStart(3, '0')}`;

      return new Promise<Asset>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          const img = new Image();
          img.onload = () => {
            resolve({
              id: assetId,
              projectId: 'proj_default',
              name: file.name,
              type: file.type,
              url,
              width: img.width || 400,
              height: img.height || 400,
              sizeBytes: file.size,
              createdAt: new Date().toISOString(),
            });
          };
          img.onerror = () => {
            resolve({
              id: assetId,
              projectId: 'proj_default',
              name: file.name,
              type: file.type,
              url,
              width: 300,
              height: 300,
              sizeBytes: file.size,
              createdAt: new Date().toISOString(),
            });
          };
          img.src = url;
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newAssetPromises).then((results) => {
      onUploadAssets(results);
      toast.success(
        'Assets uploaded',
        `Successfully added ${results.length} visual ${results.length === 1 ? 'asset' : 'assets'} to your library.`
      );
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleConfirmDelete = () => {
    if (!assetToDelete) return;
    onDeleteAsset(assetToDelete.id);
    toast.info('Asset removed', `"${assetToDelete.name}" (${assetToDelete.id}) was deleted from the library.`);
    setAssetToDelete(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Top Action Bar */}
      <div className="h-14 px-6 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold text-slate-900">Asset Library</h2>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {assets.length} visual {assets.length === 1 ? 'asset' : 'assets'} ready
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="w-56">
            <Input
              placeholder="Search by ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <GridIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Upload Button */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Upload Assets
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            onChange={(e) => e.target.files && processFiles(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Drag & Drop Upload Banner */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/60'
              : 'border-slate-200 hover:border-blue-400 bg-slate-50/50'
          }`}
        >
          <FileImage className="w-8 h-8 text-blue-600 mx-auto mb-2 opacity-80" />
          <p className="text-xs font-semibold text-slate-800">
            Drag & drop images here, or <span className="text-blue-600 underline">browse files</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports PNG, SVG, JPG, WebP. Automatically assigns unique asset IDs (A001, A002, etc.)
          </p>
        </div>

        {/* View: Grid */}
        {viewMode === 'grid' ? (
          filteredAssets.length === 0 ? (
            <div className="text-center py-12 border border-slate-200 rounded-xl">
              <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No assets match your search</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try searching for a different name or clear the search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredAssets.map((asset) => {
                const assignedScenes = sceneAssets
                  .filter((sa) => sa.assetId === asset.id)
                  .map((sa) => scenes.find((s) => s.id === sa.sceneId)?.name || 'Scene');

                return (
                  <div
                    key={asset.id}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xs hover:border-slate-300 transition-all flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="w-full aspect-square bg-slate-50 relative p-3 flex items-center justify-center border-b border-slate-100">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="max-h-full max-w-full object-contain drop-shadow-2xs group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/95 backdrop-blur-xs border border-slate-200 text-blue-700 font-mono text-[10px] font-bold rounded-md shadow-2xs">
                        {asset.id}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssetToDelete(asset);
                        }}
                        className="absolute top-2 right-2 p-1 bg-white/90 text-slate-400 hover:text-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-2xs"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Info & Scene Assignment */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-800 truncate" title={asset.name}>
                          {asset.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                          {asset.width}×{asset.height} · {(asset.sizeBytes / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setSelectedAssetForAssign(asset)}
                          className="w-full text-left text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-between"
                        >
                          <span className="truncate">
                            {assignedScenes.length > 0
                              ? `In ${assignedScenes.length} ${assignedScenes.length === 1 ? 'scene' : 'scenes'}`
                              : '+ Assign to Scene'}
                          </span>
                          <Film className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* View: High-density Table */
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-4">Asset ID</th>
                  <th className="py-2.5 px-4">Preview</th>
                  <th className="py-2.5 px-4">Filename</th>
                  <th className="py-2.5 px-4">Format</th>
                  <th className="py-2.5 px-4">Dimensions</th>
                  <th className="py-2.5 px-4">Size</th>
                  <th className="py-2.5 px-4">Assigned Scenes</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((asset) => {
                  const assignedCount = sceneAssets.filter((sa) => sa.assetId === asset.id).length;
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-4 font-mono font-bold text-blue-700">{asset.id}</td>
                      <td className="py-2 px-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-0.5">
                          <img src={asset.url} alt="" className="max-h-full max-w-full object-contain" />
                        </div>
                      </td>
                      <td className="py-2 px-4 font-medium text-slate-800">{asset.name}</td>
                      <td className="py-2 px-4 text-slate-500 font-mono text-[11px]">{asset.type.split('/')[1]}</td>
                      <td className="py-2 px-4 font-mono text-[11px] text-slate-600">{asset.width} × {asset.height}</td>
                      <td className="py-2 px-4 font-mono text-[11px] text-slate-600">{(asset.sizeBytes / 1024).toFixed(1)} KB</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => setSelectedAssetForAssign(asset)}
                          className="text-blue-600 hover:underline text-[11px] font-semibold"
                        >
                          {assignedCount} {assignedCount === 1 ? 'scene' : 'scenes'} (Edit)
                        </button>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <button
                          onClick={() => setAssetToDelete(asset)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Friendly Scene Assignment Dialog */}
      {selectedAssetForAssign && (
        <Dialog
          isOpen={true}
          onClose={() => setSelectedAssetForAssign(null)}
          title={`Assign to Scenes: ${selectedAssetForAssign.id}`}
          subtitle={`Select which scenes will include "${selectedAssetForAssign.name}".`}
          footer={
            <Button size="sm" variant="primary" onClick={() => setSelectedAssetForAssign(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-2">
            {scenes.map((scene) => {
              const isAssigned = sceneAssets.some(
                (sa) => sa.sceneId === scene.id && sa.assetId === selectedAssetForAssign.id
              );

              return (
                <div
                  key={scene.id}
                  onClick={() => {
                    if (isAssigned) {
                      onUnassignAssetFromScene(selectedAssetForAssign.id, scene.id);
                    } else {
                      onAssignAssetToScene(selectedAssetForAssign.id, scene.id);
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    isAssigned
                      ? 'border-blue-500 bg-blue-50/60 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{scene.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{scene.duration.toFixed(1)}s duration</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      isAssigned
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isAssigned && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {assetToDelete && (
        <Dialog
          isOpen={true}
          onClose={() => setAssetToDelete(null)}
          title="Remove Asset from Library?"
          subtitle={`Are you sure you want to delete "${assetToDelete.name}" (${assetToDelete.id})? It will also be unassigned from any scenes.`}
          footer={
            <>
              <Button size="sm" variant="outline" onClick={() => setAssetToDelete(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="danger" onClick={handleConfirmDelete}>
                Delete Asset
              </Button>
            </>
          }
        >
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="w-12 h-12 bg-white rounded border border-slate-200 flex items-center justify-center p-1 shrink-0">
              <img src={assetToDelete.url} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <p className="font-semibold text-slate-900 truncate">{assetToDelete.name}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                ID: {assetToDelete.id} · Size: {(assetToDelete.sizeBytes / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
