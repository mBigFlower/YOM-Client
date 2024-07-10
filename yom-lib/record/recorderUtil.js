export async function getSeekableBlob(originBlob) {
  if (!EBML) return;
  console.log('getSeekableBlob EBML', EBML)
  const Decoder = new EBML.Decoder();
  const buf = await originBlob.arrayBuffer()
  console.log('buf', buf);
  const ebmlElms = Decoder.decode(buf);
  console.log(ebmlElms);

  const reader = new EBML.Reader();
  ebmlElms.forEach(element => {
    if(element.type === 'unknown' && element.name === 'unknown')
      return;
    reader.read(element)
  });
  reader.stop();
  console.log('reader', reader)

  const refinedMetadataBuf = EBML.tools.makeMetadataSeekable(
    reader.metadatas,
    reader.duration,
    reader.cues
  )
  console.log('refinedMetadataBuf', refinedMetadataBuf)
  const body = buf.slice(reader.metadataSize)
  const aimBlob = new Blob([refinedMetadataBuf, body], {
    type: 'video/webm'
  })
  console.log('aimBlob', aimBlob)
  return aimBlob
}
