<?php

namespace App\Filament\Resources\TaskResource\Pages;

use App\Filament\Resources\TaskResource;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditTask extends EditRecord
{
    protected static string $resource = TaskResource::class;

    protected function afterSave(): void
    {
        $task = $this->record;
        $attachments = $this->form->getState()['attachments'] ?? [];

        $existingAttachments = $task->attachments->pluck('file_path')->toArray();

        $newAttachments = array_diff($attachments, $existingAttachments);

        foreach ($newAttachments as $filePath) {
            $fullPath = Storage::disk('local')->path($filePath);

            $task->attachments()->create([
                'file_path' => $filePath,
                'original_name' => basename($filePath),
                'mime_type' => mime_content_type($fullPath),
                'size' => filesize($fullPath),
            ]);
        }

        $removedAttachments = array_diff($existingAttachments, $attachments);
        foreach ($removedAttachments as $filePath) {
            $task->attachments()->where('file_path', $filePath)->delete();
            Storage::disk('local')->delete($filePath); 
        }
    }
}